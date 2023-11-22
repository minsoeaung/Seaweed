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

    public AccountsController(UserManager<User> userManager, ITokenService tokenService, IMapper mapper,
        IImageService imageService, IOptions<AwsConfig> awsConfig, IUserLoginService loginService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _mapper = mapper;
        _imageService = imageService;
        _loginService = loginService;
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
        if (user is null) return NotFound();

        var passwordValid = await _userManager.CheckPasswordAsync(user, userLoginDto.Password);
        if (!passwordValid) return BadRequest();

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
        var userLogin = await _loginService.RegisterAndLoginAsync(dto.UserName, dto.Email, dto.Password);
        if (userLogin == null)
            return BadRequest();

        var roles = new List<string>() { "User" };
        await _userManager.AddToRolesAsync(userLogin.User, roles);

        _tokenService.SetRefreshTokenInCookies(_mapper.Map<RefreshToken>(userLogin), Response);

        await _loginService.TryDeleteLoginRecord(Request.Cookies["refreshToken"]);

        return new AuthResult
        {
            AccessToken = _tokenService.GenerateAccessToken(userLogin.User, roles).AccessToken,
            AccountDetails = _mapper.Map<AccountDetails>((userLogin.User, roles.AsEnumerable()))
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
}