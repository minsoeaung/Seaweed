using API.DTOs.Requests;
using API.Entities;
using Mapster;

namespace API.Mappings;

public class ProductDtoMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CreateProductDto, Product>();
    }
}