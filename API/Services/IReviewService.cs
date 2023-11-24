using API.Entities;

namespace API.Services;

public interface IReviewService
{
    Task<IEnumerable<ProductReview>> GetReviewsExceptOwnedByUserId(int userId, int productId);

    Task<ProductReview?> GetReview(int userId, int productId);

    Task<ProductReview?> CreateOrUpdateReview(int userId, int productId, int rating, string review);

    Task DeleteReview(int userId, int productId);
}