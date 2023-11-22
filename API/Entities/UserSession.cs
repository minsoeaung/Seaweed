namespace API.Entities;

public class UserSession
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string RefreshToken { get; set; }
    public DateTime RefreshTokenCreatedAt { get; set; }
    public DateTime RefreshTokenExpiredAt { get; set; }

    public User User { get; set; }
}