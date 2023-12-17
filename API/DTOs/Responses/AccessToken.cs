namespace API.DTOs.Responses;

public class AccessToken
{
    public string Token { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiredAt { get; set; }
}