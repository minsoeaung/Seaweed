using API.Entities;

namespace API.Services;

public interface ICartService
{
    Task<IEnumerable<CartItem>> GetCartItemsAsync(int userId);

    Task AddToCartAsync(int userId, int productId, int quantity);

    Task RemoveFromCartAsync(int userId, int productId);
}