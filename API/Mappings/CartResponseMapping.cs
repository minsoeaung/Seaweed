using API.DTOs.Responses;
using API.Entities;
using Mapster;

namespace API.Mappings;

public class CartResponseMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<IEnumerable<CartItem>, CartResponse>()
            .Map(dest => dest.CartItems, src => src);
    }
}