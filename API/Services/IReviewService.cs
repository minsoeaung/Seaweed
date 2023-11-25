using API.Entities;
using API.RequestHelpers;

namespace API.Services;

public interface IReviewService
{
    Task<PagedList<ProductReview>> GetReviews(int productId, int pageNumber, int pageSize);

    Task<ProductReview?> GetReview(int userId, int productId);

    Task<ProductReview?> CreateOrUpdateReview(int userId, int productId, int rating, string review);

    Task DeleteReview(int userId, int productId);
}