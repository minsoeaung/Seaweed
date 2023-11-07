using API.DTOs.Responses;
using Mapster;

namespace API.Mappings;

public class AuthResultMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<(TokenResult tokenResult, AccountDetails accountDetails), AuthResult>()
            .Map(dest => dest.AccountDetails, src => src.accountDetails)
            .Map(dest => dest.AccessToken, src => src.tokenResult.AccessToken);
    }
}