using System.Reflection;
using Mapster;
using MapsterMapper;

namespace API.Extensions;

public static class MapsterExtensions
{
    public static void AddMappings(this IServiceCollection services)
    {
        var config = TypeAdapterConfig.GlobalSettings;

        config.Scan(Assembly.GetExecutingAssembly());

        // Very nice
        config.Default.AddDestinationTransform(DestinationTransform.EmptyCollectionIfNull);
        config.Default.IgnoreNullValues(true);

        services.AddSingleton(config);
        services.AddScoped<IMapper, ServiceMapper>();
    }
}