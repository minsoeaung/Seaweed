namespace API.Services;

public interface IMailService
{
    Task SendMailAsync(string to, string subject, string body, List<IFormFile>? attachments = null);
}