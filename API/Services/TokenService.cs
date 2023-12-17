using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using API.Configurations;
using API.DTOs.Responses;
using API.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class TokenService : ITokenService
{
    private readonly JwtConfig _jwtConfig;

    public TokenService(IOptions<JwtConfig> jwtConfig)
    {
        _jwtConfig = jwtConfig.Value;
    }

    public AccessToken GenerateAccessToken(User user, IEnumerable<string> roles)
    {
        var expiredAt = DateTime.UtcNow.AddMinutes(_jwtConfig.AccessTokenExpTimeInMinutes);
        var createdAt = DateTime.UtcNow;

        var token = CreateJwtToken(
            CreateClaims(user, roles.ToList()),
            CreateSigningCredentials(),
            expiredAt
        );

        var tokenHandler = new JwtSecurityTokenHandler();

        return new AccessToken
        {
            Token = tokenHandler.WriteToken(token),
            ExpiredAt = expiredAt,
            CreatedAt = createdAt
        };
    }

    public RefreshToken GenerateRefreshToken()
    {
        return new RefreshToken
        {
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            CreatedAt = DateTime.UtcNow,
            ExpiredAt = DateTime.UtcNow.AddDays(_jwtConfig.RefreshTokenExpTimeInDays),
        };
    }

    private JwtSecurityToken CreateJwtToken(IEnumerable<Claim> claims, SigningCredentials credentials,
        DateTime expiration) =>
        new(
            _jwtConfig.Issuer,
            _jwtConfig.Audience,
            claims,
            expires: expiration,
            signingCredentials: credentials
        );

    private IEnumerable<Claim> CreateClaims(User user, IList<string> roles)
    {
        var claims = new List<Claim>()
        {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString(CultureInfo.InvariantCulture)),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(ClaimTypes.Email, user.Email ?? string.Empty)
        };

        if (roles.Any())
            claims.AddRange(roles.Select(userRole => new Claim(ClaimTypes.Role, userRole)));

        return claims;
    }

    private SigningCredentials CreateSigningCredentials() =>
        new(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Key)),
            SecurityAlgorithms.HmacSha256
        );
}