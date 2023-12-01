using API.Entities;
using Mapster;

namespace API.Mappings;

public class OrderAddressMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Address, OrderAddress>()
            .Ignore(dest => dest.Id);
    }
}