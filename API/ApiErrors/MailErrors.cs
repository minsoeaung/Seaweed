using ErrorOr;

namespace API.ApiErrors;

public partial class Errors
{
    public static class Mail
    {
        public static Error SendFailed = Error.Failure("Mail.SendFailed", "Failed to send mail");
    }
}