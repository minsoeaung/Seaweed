using API.DTOs.Responses;
using API.Entities;
using Mapster;

namespace API.Mappings;

public class ReviewResponseMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ProductReview, ReviewResponse>()
            .Map(dest => dest.UserName, src => src.User.UserName)
            .Map(dest => dest.UserProfilePicture, src => src.User.ProfilePicture);

        config.ForType<IEnumerable<ProductReview>, IEnumerable<ReviewResponse>>()
            .Map(dest => dest, src => src.AsEnumerable().Adapt<IEnumerable<ReviewResponse>>());
    }
}