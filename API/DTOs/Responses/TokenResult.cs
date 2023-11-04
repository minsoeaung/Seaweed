namespace API.DTOs.Responses;

public class TokenResult
{
    public string AccessToken { get; set; }
    public DateTime ExpTime { get; set; }
}