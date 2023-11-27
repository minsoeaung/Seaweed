using API.DTOs.Responses;
using API.Entities;

namespace API.Services;

public interface ITokenService
{
    TokenResult GenerateAccessToken(User user, IEnumerable<string> roles);
    RefreshToken GenerateRefreshToken();

    // TODO: "SetRefreshTokenInCookies" should not exist. HttpResponse is coupled to HTTP only
    // Services are meant to be reusable across different layers
    void SetRefreshTokenInCookies(RefreshToken token, HttpResponse response);
    void DeleteRefreshTokenInCookies(HttpResponse response);
}