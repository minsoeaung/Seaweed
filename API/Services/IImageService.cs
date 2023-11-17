using Amazon.S3.Model;

namespace API.Services;

public interface IImageService
{
    Task<PutObjectResponse> UploadProductImageAsync(int id, IFormFile file);

    Task<DeleteObjectResponse> DeleteProductImageAsync(int id);
}