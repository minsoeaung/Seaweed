using Amazon.S3.Model;

namespace API.Services;

public interface IImageService
{
    Task<PutObjectResponse> UploadImageAsync(int id, IFormFile file, string folder);

    Task<DeleteObjectResponse> DeleteImageAsync(int id, string folder);
}