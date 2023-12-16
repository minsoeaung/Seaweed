using ErrorOr;

namespace API.ApiErrors;

public static partial class Errors
{
    public static class Country
    {
        public static Error NotFound = Error.NotFound("Country.NotFound", "Country not found.");
    }
}