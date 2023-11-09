using System.Security.Claims;
using API.DTOs.Requests;
using API.DTOs.Responses;
using API.Entities;
using API.Extensions;
using API.Services;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AccountsController(UserManager<User> userManager, ITokenService tokenService, IMapper mapper)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _mapper = mapper;
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

        return _mapper.Map<AccountDetails>((user, roles));
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

        await _userManager.AddToRoleAsync(user, "Admin");

        return Ok();
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResult>> Login(LoginDto userLoginDto)
    {
        var user = await _userManager.FindByNameAsync(userLoginDto.UserName);

        if (user is null)
            return NotFound();

        var passwordValid = await _userManager.CheckPasswordAsync(user, userLoginDto.Password);

        if (!passwordValid)
            return BadRequest();

        var roles = await _userManager.GetRolesAsync(user);

        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        await _userManager.UpdateAsync(user);
        _tokenService.SetRefreshTokenInCookies(refreshToken, Response);

        var accountDetails = _mapper.Map<AccountDetails>((user, roles.AsEnumerable()));
        var accessToken = _tokenService.GenerateAccessToken(user, roles);

        return new AuthResult
        {
            AccessToken = accessToken.AccessToken,
            AccountDetails = accountDetails
        };
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResult>> Register(RegisterDto model)
    {
        var user = new User()
        {
            UserName = model.UserName,
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
        };

        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
            return BadRequest();

        _tokenService.SetRefreshTokenInCookies(refreshToken, Response);
        await _userManager.AddToRoleAsync(user, "User");

        var roles = new List<string>() { "User" };
        var createdUser = await _userManager.FindByNameAsync(user.UserName);

        var accountDetails = _mapper.Map<AccountDetails>((createdUser, roles.AsEnumerable()));
        var accessToken = _tokenService.GenerateAccessToken(createdUser!, roles);

        return new AuthResult
        {
            AccessToken = accessToken.AccessToken,
            AccountDetails = accountDetails
        };
    }

    [HttpGet("renew-tokens")]
    public async Task<ActionResult<TokenResult>> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (refreshToken is null)
            return BadRequest();

        var user = await _userManager.FindByRefreshTokenAsync(refreshToken);
        if (user is null)
            return BadRequest();

        if (user.RefreshToken.ExpiredAt < DateTime.UtcNow)
            return BadRequest();

        var newRefreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        await _userManager.UpdateAsync(user);
        _tokenService.SetRefreshTokenInCookies(newRefreshToken, Response);

        var roles = await _userManager.GetRolesAsync(user);

        return _tokenService.GenerateAccessToken(user, roles);
    }

    [HttpGet("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (refreshToken is null)
            return Ok();

        var user = await _userManager.FindByRefreshTokenAsync(refreshToken);
        if (user is null)
            return Ok();

        _tokenService.DeleteRefreshTokenInCookies(Response);
        user.RefreshToken.Token = null;
        await _userManager.UpdateAsync(user);
        return Ok();
    }
}