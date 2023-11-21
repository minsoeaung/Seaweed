using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class User : IdentityUser<int>
{
    public RefreshToken RefreshToken { get; set; }
    public string? ProfilePicture { get; set; }
}