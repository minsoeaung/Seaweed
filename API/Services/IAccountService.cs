using API.DTOs.Responses;
using API.Entities;
using ErrorOr;

namespace API.Services;

public interface IAccountService
{
    Task<ErrorOr<(User, IList<string> roles)>> GetAccount(int userId);

    Task<ErrorOr<Updated>> UpdateProfilePicture(int userId, IFormFile picture);

    Task<ErrorOr<Created>> CreateAdminAccount(string username, string email, string password);

    Task<ErrorOr<(User, AccessToken, RefreshToken, IList<string> roles)>>
        LoginAccount(string username, string password);

    Task<ErrorOr<(User, AccessToken, RefreshToken, IList<string> roles)>>
        RegisterAccount(string username, string email, string password);

    Task<ErrorOr<(AccessToken, RefreshToken)>> RenewsTheTokens(string refreshToken);

    Task<ErrorOr<Success>> LogoutAccount(string refreshToken);

    Task<ErrorOr<Success>> VerifyEmail(int userId, string token);

    Task<ErrorOr<Updated>> UpdateUserName(int userId, string newUserName);

    Task<ErrorOr<Deleted>> DeleteAccount(int userId, string password);

    Task<ErrorOr<Updated>> UpdateAccountPassword(string email, string token, string newPassword);
}