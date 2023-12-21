using API.Entities;
using API.RequestHelpers;
using ErrorOr;

namespace API.Services;

public interface IReviewService
{
    Task<PagedList<ProductReview>> GetReviews(int productId, int pageNumber, int pageSize);

    Task<ErrorOr<ProductReview>> GetReview(int userId, int productId);

    Task<ErrorOr<ProductReview>> CreateOrUpdateReview(int userId, int productId, int rating, string review);

    Task<ErrorOr<Deleted>> DeleteReview(int userId, int productId);
}