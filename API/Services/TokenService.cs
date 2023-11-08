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

    public TokenResult GenerateAccessToken(User user, IEnumerable<string> roles)
    {
        var expiration = DateTime.UtcNow.AddMinutes(_jwtConfig.AccessTokenExpTimeInMinutes);

        var token = CreateJwtToken(
            CreateClaims(user, roles.ToList()),
            CreateSigningCredentials(),
            expiration
        );

        var tokenHandler = new JwtSecurityTokenHandler();

        return new TokenResult
        {
            AccessToken = tokenHandler.WriteToken(token),
            ExpTime = expiration
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

    public void SetRefreshTokenInCookies(RefreshToken token, HttpResponse response)
    {
        if (token.Token is null)
            throw new InvalidOperationException();

        var cookieOptions = new CookieOptions
        {
            Secure = true,
            HttpOnly = true,
            Expires = token.ExpiredAt,
            IsEssential = true,
            SameSite = SameSiteMode.None,
        };

        response.Cookies.Append("refreshToken", token.Token, cookieOptions);
    }

    public void DeleteRefreshTokenInCookies(HttpResponse response)
    {
        var cookieOptions = new CookieOptions
        {
            Secure = true,
            HttpOnly = true,
            Expires = DateTime.Now.AddDays(-1),
            IsEssential = true,
            SameSite = SameSiteMode.None,
        };

        response.Cookies.Append("refreshToken", "", cookieOptions);
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