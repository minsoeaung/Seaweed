using API.DTOs.Responses;
using API.Entities;
using Mapster;

namespace API.Mappings;

public class RefreshTokenMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<UserSession, RefreshToken>()
            .Map(dest => dest.Token, src => src.RefreshToken)
            .Map(dest => dest.CreatedAt, src => src.RefreshTokenCreatedAt)
            .Map(dest => dest.ExpiredAt, src => src.RefreshTokenExpiredAt);
    }
}