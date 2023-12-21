using ErrorOr;

namespace API.ApiErrors;

public static partial class Errors
{
    public static class ProductReview
    {
        public static Error NotFound =
            Error.NotFound("ProductReview.NotFound", "Review not found.");
    }
}