using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class UserManagerExtensions
{
    public static async Task<User?> FindByRefreshTokenAsync(this UserManager<User> um, string token)
    {
        return await um.Users.SingleOrDefaultAsync(x => x.RefreshToken.Token == token);
    }
}