using API.Data;

namespace API.Extensions;

public static class DbInitializer
{
    public static void CreateDbIfNotExists(this IHost host)
    {
        var scope = host.Services.CreateScope();
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<StoreContext>();
        context.Database.EnsureCreated();
        Seeders.Seed(context);
    }
}