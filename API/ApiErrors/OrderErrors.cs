using ErrorOr;

namespace API.ApiErrors;

public static partial class Errors
{
    public static class Order
    {
        public static Error NoItemInCart =
            Error.Validation("Order.NoItemInCart", "There are no items in cart.");
    }
}