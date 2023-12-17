using API.DTOs.Responses;
using API.Entities;

namespace API.Services;

public interface ITokenService
{
    AccessToken GenerateAccessToken(User user, IEnumerable<string> roles);
    RefreshToken GenerateRefreshToken();
}