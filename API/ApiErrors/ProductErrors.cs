using ErrorOr;

namespace API.ApiErrors;

public static partial class Errors
{
    public static class Product
    {
        public static Error NotFound = Error.NotFound("Product.NotFound", "Product not found.");

        public static Error NotEnoughQuantity =
            Error.Validation("Product.NotEnoughQuantity", "The product does not have enough quantity.");

        public static Error AddFailure = Error.Failure("Product.AddFailed", "Failed to add Product.");
        
        public static Error UpdateFailure = Error.Failure("Product.UpdateFailure", "Failed to update Product.");

        public static Error ImageUploadFailure =
            Error.Failure("Product.ImageUploadFailure", "Failed to upload product image.");
    }
}