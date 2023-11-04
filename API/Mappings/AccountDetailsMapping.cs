using API.DTOs.Responses;
using API.Entities;
using Mapster;

namespace API.Mappings;

public class AccountDetailsMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<(User user, IList<string> roles), AccountDetails>()
            .Map(dest => dest.Roles, src => src.roles)
            .Map(dest => dest, src => src.user);
    }
}