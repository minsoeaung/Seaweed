using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Web;
using API.ApiErrors;
using API.Configurations;
using API.DTOs.Requests;
using API.DTOs.Responses;
using API.Entities;
using API.Services;
using ErrorOr;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace API.Controllers;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[ApiController]
[Route("api/[controller]")]
public class AccountsController : BaseApiController
{
    private readonly UserManager<User> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    private readonly IImageService _imageService;
    private readonly IUserLoginService _loginService;
    private readonly AwsConfig _awsConfig;
    private readonly IMailService _mailService;

    public AccountsController(UserManager<User> userManager, ITokenService tokenService, IMapper mapper,
        IImageService imageService, IOptions<AwsConfig> awsConfig, IUserLoginService loginService,
        IMailService mailService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _mapper = mapper;
        _imageService = imageService;
        _loginService = loginService;
        _mailService = mailService;
        _awsConfig = awsConfig.Value;
    }

    [HttpGet("me")]
    public async Task<ActionResult<AccountDetails>> Me()
    {
        var email = User.FindFirstValue(ClaimTypes.Email);
        if (email is null)
            return BadRequest();

        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
            return BadRequest();

        return _mapper.Map<AccountDetails>((user, await _userManager.GetRolesAsync(user)));
    }

    [HttpPost("profile-picture")]
    public async Task<ActionResult> UpdateProfilePicture([Required] [FromForm] IFormFile picture)
    {
        var email = User.FindFirstValue(ClaimTypes.Email);
        if (email is null)
            return BadRequest();

        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
            return BadRequest();

        await _imageService.UploadImageAsync(user.Id, picture, ImageFolders.UserImages);

        // ProfilePicture is always the same, only the pic is changed.
        if (user.ProfilePicture == null)
        {
            user.ProfilePicture = $"{_awsConfig.DistributionDomainName}/{ImageFolders.UserImages}/{user.Id}";
            await _userManager.UpdateAsync(user);
        }

        return NoContent();
    }

    [Authorize(Roles = "Super")]
    [HttpPost("register-admin")]
    public async Task<IActionResult> RegisterAdmin(RegisterDto model)
    {
        var userExists = await _userManager.FindByNameAsync(model.UserName);
        if (userExists is not null)
            return BadRequest();

        var user = new User()
        {
            UserName = model.UserName,
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserAddress = new UserAddress()
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
            return BadRequest();

        await _userManager.AddToRolesAsync(user, new List<string> { "Admin", "User" });
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<AuthResult>> Login(LoginDto userLoginDto)
    {
        List<Error> errors = new();

        var user = await _userManager.FindByNameAsync(userLoginDto.UserName.Trim());
        if (user is null)
        {
            errors.Add(Errors.User.NotFoundUsername);
            return Problem(errors);
        }

        var passwordValid = await _userManager.CheckPasswordAsync(user, userLoginDto.Password);
        if (!passwordValid)
        {
            errors.Add(Errors.User.IncorrectPassword);
            return Problem(errors);
        }

        var userLogin = await _loginService.LoginAsync(user);
        _tokenService.SetRefreshTokenInCookies(_mapper.Map<RefreshToken>(userLogin), Response);

        var roles = await _userManager.GetRolesAsync(user);
        return new AuthResult
        {
            AccessToken = _tokenService.GenerateAccessToken(user, roles).AccessToken,
            AccountDetails = _mapper.Map<AccountDetails>((user, roles))
        };
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<AuthResult>> Register(RegisterDto dto)
    {
        var user = new User
        {
            UserName = dto.UserName.Trim(),
            Email = dto.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserAddress = new UserAddress()
        };

        var userResult = await _userManager.CreateAsync(user, dto.Password);
        if (!userResult.Succeeded)
        {
            foreach (var identityError in userResult.Errors)
                ModelState.AddModelError(identityError.Code, identityError.Description);

            return ValidationProblem();
        }

        IList<string> roles = new List<string> { "User" };
        await _userManager.AddToRolesAsync(user, roles);

        var userSession = await _loginService.LoginAsync(user);
        _tokenService.SetRefreshTokenInCookies(_mapper.Map<RefreshToken>(userSession), Response);

        return new AuthResult
        {
            AccessToken = _tokenService.GenerateAccessToken(userSession.User, roles).AccessToken,
            AccountDetails = _mapper.Map<AccountDetails>((userSession.User, roles))
        };
    }

    [AllowAnonymous]
    [HttpGet("renew-tokens")]
    public async Task<ActionResult<TokenResult>> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (refreshToken == null)
            return Problem(new List<Error> { Errors.User.InvalidRefreshToken });

        var userSessionOrError = await _loginService.RenewToken(refreshToken);

        if (userSessionOrError.IsError)
            return Problem(userSessionOrError.Errors);

        _tokenService.SetRefreshTokenInCookies(_mapper.Map<RefreshToken>(userSessionOrError.Value), Response);

        var user = userSessionOrError.Value.User;

        return _tokenService.GenerateAccessToken(user, await _userManager.GetRolesAsync(user));
    }

    [AllowAnonymous]
    [HttpGet("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (refreshToken == null)
            return Problem(new List<Error> { Errors.User.InvalidRefreshToken });

        await _loginService.TryDeleteLoginRecord(refreshToken);

        _tokenService.DeleteRefreshTokenInCookies(Response);

        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("verify-email")]
    public async Task<ActionResult> ConfirmEmail(string userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return Problem(new List<Error> { Errors.User.NotFound });

        var result = await _userManager.ConfirmEmailAsync(user, token);
        if (result.Succeeded)
            return Ok("Your email is verified.\nPlease refresh your page to see changes.");

        var errors = result.Errors
            .Select(identityError => Error.Validation(identityError.Code, identityError.Description)).ToList();

        return Problem(errors);
    }

    [HttpPost("send-verification-mail")]
    public async Task<ActionResult> SendConfirmEmailLink()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return Problem(new List<Error> { Errors.User.NotFound });

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        var url = Request.Scheme +
                  "://" +
                  Request.Host +
                  Url.Action(
                      nameof(ConfirmEmail),
                      "Accounts",
                      new { userId = user.Id, token }
                  );

        await _mailService.SendMailAsync(user.Email ?? string.Empty, "Verify your email address",
            $"Hi, {user.UserName}. Please click the link below to verify your email address: <br/><br/> {url}");
        return Ok();
    }

    [HttpPost("username")]
    public async Task<ActionResult> UpdateUsername([StringLength(50, MinimumLength = 4,
            ErrorMessage = "Username must have a minimum length of 4 and a maximum length of 50.")]
        string username)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return Problem(new List<Error> { Errors.User.NotFound });

        user.UserName = username.Trim();

        var result = await _userManager.UpdateAsync(user);

        if (result.Succeeded)
            return Ok();

        var errors = result.Errors
            .Select(identityError => Error.Validation(identityError.Code, identityError.Description)).ToList();
        return Problem(errors);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAccount(string id, string password)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return Problem(new List<Error> { Errors.User.NotFound });

        var passwordValid = await _userManager.CheckPasswordAsync(user, password);
        if (!passwordValid)
            return Problem(new List<Error> { Errors.User.IncorrectPassword });

        var result = await _userManager.DeleteAsync(user);
        if (result.Succeeded)
        {
            await _imageService.DeleteImageAsync(user.Id, ImageFolders.UserImages);
            return Ok();
        }

        var errors = result.Errors
            .Select(identityError => Error.Validation(identityError.Code, identityError.Description)).ToList();
        return Problem(errors);
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword(ResetPasswordDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            return Problem(new List<Error> { Errors.User.NotFoundEmail });

        var result = await _userManager.ResetPasswordAsync(user, HttpUtility.UrlDecode(dto.Token), dto.NewPassword);
        if (result.Succeeded) return Ok();

        var errors = result.Errors
            .Select(identityError => Error.Validation(identityError.Code, identityError.Description)).ToList();
        return Problem(errors);
    }

    [AllowAnonymous]
    [HttpPost("send-reset-password-mail")]
    public async Task<ActionResult> SendResetPasswordMail(string email, string clientUrl)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return Problem(new List<Error> { Errors.User.NotFoundEmail });

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        var url = $"{clientUrl}?token={HttpUtility.UrlEncode(token)}&email={email}";

        await _mailService.SendMailAsync(user.Email ?? string.Empty, "Password Reset Request",
            $"Hi, {user.UserName}. Please click the link below to reset your password: <br/><br/> <a href=\"{url}\" target=\"_blank\">[{clientUrl}]</a> <br/><br/> The link will expire in 24h. If the link has expired, you can initiate another password reset request.\n");
        return Ok();
    }
}