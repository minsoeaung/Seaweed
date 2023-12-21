using API.Entities;
using ErrorOr;

namespace API.Services;

public interface ICartService
{
    Task<IEnumerable<CartItem>> GetCartItemsAsync(int userId);

    Task<ErrorOr<Updated>> AddToCartAsync(int userId, int productId, int quantity);

    Task<ErrorOr<Deleted>> RemoveFromCartAsync(int userId, int productId);
}