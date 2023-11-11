using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class CartService : ICartService
{
    private readonly StoreContext _storeContext;

    public CartService(StoreContext storeContext)
    {
        _storeContext = storeContext;
    }

    public async Task<IEnumerable<CartItem>> GetCartItemsAsync(int userId)
    {
        return await _storeContext.CartItems
            .Where(c => c.UserId == userId)
            .Include(c => c.Product)
            .ThenInclude(p => p.Brand)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task AddToCartAsync(int userId, int productId, int quantity)
    {
        if (int.IsNegative(quantity))
            return;

        var product = await _storeContext.Products.FindAsync(productId);
        if (product == null)
            return;

        var cartItem = await _storeContext.CartItems
            .SingleOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

        if (quantity == 0 && cartItem != null)
        {
            _storeContext.CartItems.Remove(cartItem);
            await _storeContext.SaveChangesAsync();
            return;
        }

        var newQuantity = product.QuantityInStock < quantity ? product.QuantityInStock : quantity;

        if (cartItem == null)
        {
            cartItem = new CartItem
            {
                UserId = userId,
                ProductId = productId,
                Quantity = newQuantity,
            };

            await _storeContext.CartItems.AddAsync(cartItem);
            if (cartItem.Quantity <= 0)
                _storeContext.CartItems.Remove(cartItem);
        }
        else
        {
            cartItem.Quantity = newQuantity;
        }

        await _storeContext.SaveChangesAsync();
    }

    public async Task RemoveFromCartAsync(int userId, int productId)
    {
        var product = await _storeContext.Products.FindAsync(productId);
        if (product is null)
            return;

        var cartItem = await _storeContext.CartItems
            .SingleOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

        if (cartItem == null)
            return;

        _storeContext.CartItems.Remove(cartItem);
        await _storeContext.SaveChangesAsync();
    }
}