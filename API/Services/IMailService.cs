using ErrorOr;

namespace API.Services;

public interface IMailService
{
    Task<ErrorOr<Created>> SendMailAsync(string to, string subject, string body, List<IFormFile>? attachments = null);
}