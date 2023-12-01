using API.DTOs.Responses;
using API.Entities;
using Mapster;

namespace API.Mappings;

public class CartDetailsMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<IEnumerable<CartItem>, CartDetails>()
            .Map(dest => dest.CartItems, src => src);
    }
}