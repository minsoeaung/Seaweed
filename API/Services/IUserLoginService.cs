using API.Entities;

namespace API.Services;

public interface IUserLoginService
{
    Task TryDeleteLoginRecord(string? refreshToken);

    Task<UserSession> LoginAsync(User user);

    Task<UserSession?> RegisterAndLoginAsync(string username, string email, string password);

    Task<UserSession?> RenewToken(string? currentToken);
}