using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class UserLoginService : IUserLoginService
{
    private readonly StoreContext _context;
    private readonly ITokenService _tokenService;
    private readonly UserManager<User> _userManager;

    public UserLoginService(StoreContext context, ITokenService tokenService, UserManager<User> userManager)
    {
        _context = context;
        _tokenService = tokenService;
        _userManager = userManager;
    }

    public async Task<UserSession?> RenewToken(string? currentToken)
    {
        if (currentToken == null)
            return null;

        var userLogin = await _context.UserSessions
            .Include(l => l.User)
            .FirstOrDefaultAsync(l => l.RefreshToken == currentToken);

        if (userLogin == null)
            return null;

        if (userLogin.RefreshTokenExpiredAt < DateTime.UtcNow)
        {
            _context.UserSessions.Remove(userLogin);
            await _context.SaveChangesAsync();
            return null;
        }

        var newRefreshToken = _tokenService.GenerateRefreshToken();
        userLogin.RefreshToken = newRefreshToken.Token;
        userLogin.RefreshTokenCreatedAt = newRefreshToken.CreatedAt;
        userLogin.RefreshTokenExpiredAt = newRefreshToken.ExpiredAt;

        _context.UserSessions.Update(userLogin);
        await _context.SaveChangesAsync();

        return userLogin;
    }

    public async Task TryDeleteLoginRecord(string? refreshToken)
    {
        if (refreshToken != null)
        {
            var existing = await _context.UserSessions.FirstOrDefaultAsync(l => l.RefreshToken == refreshToken);
            if (existing != null)
            {
                _context.UserSessions.Remove(existing);
                await _context.SaveChangesAsync();
            }
        }
    }

    public async Task<UserSession> LoginAsync(User user)
    {
        var token = _tokenService.GenerateRefreshToken();

        var userLogin = new UserSession
        {
            RefreshToken = token.Token,
            RefreshTokenCreatedAt = token.CreatedAt,
            RefreshTokenExpiredAt = token.ExpiredAt,
            UserId = user.Id,
            User = user
        };

        await _context.UserSessions.AddAsync(userLogin);
        await _context.SaveChangesAsync();

        return userLogin;
    }

    public async Task<UserSession?> RegisterAndLoginAsync(string username, string email, string password)
    {
        var user = new User()
        {
            UserName = username,
            Email = email,
            SecurityStamp = Guid.NewGuid().ToString(),
        };

        var userResult = await _userManager.CreateAsync(user, password);
        if (!userResult.Succeeded)
            return null;

        var refreshToken = _tokenService.GenerateRefreshToken();

        var userLogin = new UserSession
        {
            RefreshToken = refreshToken.Token,
            RefreshTokenCreatedAt = refreshToken.CreatedAt,
            RefreshTokenExpiredAt = refreshToken.ExpiredAt,
            UserId = user.Id,
            User = user
        };

        await _context.UserSessions.AddAsync(userLogin);
        await _context.SaveChangesAsync();

        return userLogin;
    }
}