using ErrorOr;

namespace API.ApiErrors;

public static partial class Errors
{
    public static class Cart
    {
        public static Error NegativeQuantity =
            Error.Validation("Cart.NegativeQuantity", "Negative quantity is not allowed.");
        
        public static Error CartItemNotFound =
            Error.NotFound("Cart.CartItemNotFound", "Cart item not found.");
    }
}