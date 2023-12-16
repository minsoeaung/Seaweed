using ErrorOr;

namespace API.ApiErrors;

public static partial class Errors
{
    public static class Address
    {
        public static Error NotFound = Error.NotFound("Address.NotFound", "Address not found.");
        public static Error AddFailure = Error.Failure("Address.AddFailed", "Failed to add address");
    }
}