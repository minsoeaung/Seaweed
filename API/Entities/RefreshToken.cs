using Microsoft.EntityFrameworkCore;

namespace API.Entities;

[Owned]
public class RefreshToken
{
    public string? Token { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiredAt { get; set; }
}