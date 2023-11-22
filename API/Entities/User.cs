using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class User : IdentityUser<int>
{
    public string? ProfilePicture { get; set; }
}