using API.DTOs.Responses;
using API.Entities;

namespace API.Services;

public interface ITokenService
{
    TokenResult GenerateAccessToken(User user, IEnumerable<string> roles);
    RefreshToken GenerateRefreshToken();
    void SetRefreshTokenInCookies(RefreshToken token, HttpResponse response);
    void DeleteRefreshTokenInCookies(HttpResponse response);
}