using API.DTOs.Responses;
using API.Entities;

namespace API.Services;

public interface ITokenService
{
    TokenResult GenerateToken(User user, IList<string> roles);
}