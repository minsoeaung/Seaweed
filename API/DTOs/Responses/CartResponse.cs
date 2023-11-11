using API.Entities;

namespace API.DTOs.Responses;

public class CartResponse
{
    public double Total => CartItems.Sum(c => c.Total);
    public IEnumerable<CartItemWithTotal> CartItems { get; set; } = new List<CartItemWithTotal>();
}

public class CartItemWithTotal : CartItem
{
    public double Total => Math.Round(Quantity * Product.Price, 2);
}