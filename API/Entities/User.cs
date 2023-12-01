using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class User : IdentityUser<int>
{
    public string? ProfilePicture { get; set; }
    public UserAddress UserAddress { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}