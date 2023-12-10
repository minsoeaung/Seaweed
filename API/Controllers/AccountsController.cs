using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using API.Configurations;
using API.DTOs.Requests;
using API.DTOs.Responses;
using API.Entities;
using API.Services;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
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

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpGet("me")]
    public async Task<ActionResult<AccountDetails>> Me()
    {
        var email = User.FindFirstValue(ClaimTypes.Email);
        if (email is null)
            return BadRequest();

        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
            return BadRequest();

        var roles = await _userManager.GetRolesAsync(user);

        return _mapper.Map<AccountDetails>((user, roles.AsEnumerable()));
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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

    [HttpPost("login")]
    public async Task<ActionResult<AuthResult>> Login(LoginDto userLoginDto)
    {
        var user = await _userManager.FindByNameAsync(userLoginDto.UserName.Trim());
        if (user is null)
        {
            ModelState.AddModelError("Username", "Account not found. Please check your username and try again.");
            return ValidationProblem();
        }

        var passwordValid = await _userManager.CheckPasswordAsync(user, userLoginDto.Password);
        if (!passwordValid)
        {
            ModelState.AddModelError("Password",
                "Password is incorrect. Verify your password and attempt login again.");
            return ValidationProblem();
        }

        var userLogin = await _loginService.LoginAsync(user);

        await _loginService.TryDeleteLoginRecord(Request.Cookies["refreshToken"]);

        var roles = await _userManager.GetRolesAsync(user);

        _tokenService.SetRefreshTokenInCookies(_mapper.Map<RefreshToken>(userLogin), Response);

        return new AuthResult
        {
            AccessToken = _tokenService.GenerateAccessToken(user, roles).AccessToken,
            AccountDetails = _mapper.Map<AccountDetails>((user, roles.AsEnumerable()))
        };
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResult>> Register(RegisterDto dto)
    {
        var user = new User()
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
            {
                ModelState.AddModelError(identityError.Code, identityError.Description);
            }

            return ValidationProblem();
        }

        var roles = new List<string>() { "User" };
        await _userManager.AddToRolesAsync(user, roles);

        var userSession = await _loginService.LoginAsync(user);

        _tokenService.SetRefreshTokenInCookies(_mapper.Map<RefreshToken>(userSession), Response);

        await _loginService.TryDeleteLoginRecord(Request.Cookies["refreshToken"]);

        return new AuthResult
        {
            AccessToken = _tokenService.GenerateAccessToken(userSession.User, roles).AccessToken,
            AccountDetails = _mapper.Map<AccountDetails>((userSession.User, roles.AsEnumerable()))
        };
    }

    [HttpGet("renew-tokens")]
    public async Task<ActionResult<TokenResult>> Refresh()
    {
        var userLogin = await _loginService.RenewToken(Request.Cookies["refreshToken"]);
        if (userLogin == null)
            return BadRequest();

        _tokenService.SetRefreshTokenInCookies(_mapper.Map<RefreshToken>(userLogin), Response);

        return _tokenService.GenerateAccessToken(userLogin.User, await _userManager.GetRolesAsync(userLogin.User));
    }

    [HttpGet("logout")]
    public async Task<IActionResult> Logout()
    {
        await _loginService.TryDeleteLoginRecord(Request.Cookies["refreshToken"]);

        _tokenService.DeleteRefreshTokenInCookies(Response);

        return Ok();
    }

    [HttpGet("verify-email")]
    public async Task<ActionResult> ConfirmEmail(string userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return NotFound();

        var result = await _userManager.ConfirmEmailAsync(user, token);
        return result.Succeeded
            ? Ok("Your email is verified.\nRefresh your page to see changes.")
            : BadRequest(result.Errors);
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost("send-verification-mail")]
    public async Task<ActionResult> SendConfirmEmailLink()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return BadRequest();

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return NotFound();

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
            $"Hi, {user.UserName}. Please click the link below to verify your email address: <br/> {url}");
        return Ok();
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [HttpPost("username")]
    public async Task<ActionResult> UpdateUsername([StringLength(50, MinimumLength = 4,
            ErrorMessage = "Username must have a minimum length of 4 and a maximum length of 50.")]
        string username)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return BadRequest();

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
            return NotFound();

        user.UserName = username.Trim();

        var result = await _userManager.UpdateAsync(user);

        if (result.Succeeded)
            return Ok();

        foreach (var identityError in result.Errors)
        {
            ModelState.AddModelError(identityError.Code, identityError.Description);
        }

        return ValidationProblem();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAccount(string id, string password)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound();

        var passwordValid = await _userManager.CheckPasswordAsync(user, password);
        if (!passwordValid)
        {
            ModelState.AddModelError("Invalid password", "Your password is not correct.");
            return ValidationProblem();
        }

        var result = await _userManager.DeleteAsync(user);
        if (result.Succeeded)
            return Ok();

        foreach (var identityError in result.Errors)
        {
            ModelState.AddModelError(identityError.Code, identityError.Description);
        }

        return ValidationProblem();
    }
}