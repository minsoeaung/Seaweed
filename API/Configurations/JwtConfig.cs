namespace API.Configurations;

public class JwtConfig
{
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public string Key { get; set; }
    public int AccessTokenExpTimeInMinutes { get; set; } = 15;
    public int RefreshTokenExpTimeInDays { get; set; } = 7;
}