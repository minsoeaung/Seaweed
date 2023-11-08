using API.DTOs.Responses;
using Mapster;

namespace API.Mappings;

public class AccountDetailsMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<(Entities.User User, IEnumerable<string> Roles), AccountDetails>()
            .Map(dest => dest.Roles, src => src.Roles)
            .Map(dest => dest, src => src.User);
    }
}