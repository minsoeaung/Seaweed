using API.Entities;
using ErrorOr;

namespace API.Services;

public interface IUserLoginService
{
    Task TryDeleteLoginRecord(string refreshToken);

    // TODO: should not coupled with "User" entity, use plain C# type
    Task<UserSession> LoginAsync(User user);

    Task<ErrorOr<UserSession>> RenewToken(string refreshToken);
}