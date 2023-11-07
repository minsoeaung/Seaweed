namespace API.DTOs.Responses;

public class AuthResult
{
    public string AccessToken { get; set; }
    public AccountDetails AccountDetails { get; set; }
}