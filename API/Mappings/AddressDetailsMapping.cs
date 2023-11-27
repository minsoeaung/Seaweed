using API.DTOs.Responses;
using API.Entities;
using Mapster;

namespace API.Mappings;

public class AddressDetailsMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<UserAddress, AddressDetails>()
            .Map(dest => dest, src => src.Addresses);

        config.ForType<IEnumerable<UserAddress>, IEnumerable<AddressDetails>>()
            .Map(dest => dest, src => src.AsEnumerable().Adapt<IEnumerable<AddressDetails>>());
    }
}