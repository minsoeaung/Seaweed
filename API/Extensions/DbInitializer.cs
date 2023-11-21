using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class DbInitializer
{
    public static async void CreateDbIfNotExistsAndSeed(this IHost host)
    {
        var scope = host.Services.CreateScope();
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<StoreContext>();
        var userManager = services.GetRequiredService<UserManager<User>>();
        await context.Database.EnsureCreatedAsync();
        await context.Database.MigrateAsync();
        await Seeders.Seed(context, userManager);
    }
}