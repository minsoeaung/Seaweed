using ErrorOr;

namespace API.ApiErrors;

public partial class Errors
{
    public static class User
    {
        public static Error NotFound = Error.NotFound("User.NotFound", "User not found.");

        public static Error ExpiredToken =
            Error.Unauthorized("User.ExpiredRefreshToken", "Refresh token has expired.");

        public static Error InvalidRefreshToken =
            Error.Unauthorized("User.InvalidRefreshToken", "Refresh token is invalid.");

        public static Error NotFoundUsername = Error.NotFound("User.NotFoundUsername",
            "No account was found for the provided username.");

        public static Error NotFoundEmail = Error.NotFound("User.NotFoundEmail",
            "No account was found for the provided email address.");

        public static Error IncorrectPassword = Error.Validation("User.IncorrectPassword",
            "Incorrect password provided.");

        public static Error DuplicateEmail =
            Error.Conflict("User.DuplicateEmail", "User with given email already exists.");

        public static Error DuplicateUserName =
            Error.Conflict("User.DuplicateUserName", "User with given username already exists.");
    }
}