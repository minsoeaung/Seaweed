using API.Entities;

namespace API.Services;

public interface IUserLoginService
{
    Task TryDeleteLoginRecord(string? refreshToken);

    Task<UserSession> LoginAsync(User user);

    Task<UserSession?> RenewToken(string? currentToken);
}