using Amazon.S3;
using Amazon.S3.Model;
using API.Configurations;
using Microsoft.Extensions.Options;

namespace API.Services;

public class ImageService : IImageService
{
    private readonly IAmazonS3 _s3;
    private readonly AwsConfig _awsConfig;
    private const string ProductImages = "product_images";

    public ImageService(IOptions<AwsConfig> awsConfig, IAmazonS3 s3)
    {
        _awsConfig = awsConfig.Value;
        _s3 = s3;
    }


    public async Task<PutObjectResponse> UploadProductImageAsync(int id, IFormFile file)
    {
        var pubObjectRequest = new PutObjectRequest()
        {
            BucketName = _awsConfig.BucketName,
            Key = $"{ProductImages}/{id}",
            ContentType = file.ContentType,
            InputStream = file.OpenReadStream(), // Better than ContentBody
            Metadata =
            {
                ["x-amz-meta-originalname"] = file.FileName,
                ["x-amz-meta-extension"] = Path.GetExtension(file.FileName)
            }
        };

        return await _s3.PutObjectAsync(pubObjectRequest);
    }

    public async Task<DeleteObjectResponse> DeleteProductImageAsync(int id)
    {
        var deleteObjectRequest = new DeleteObjectRequest
        {
            BucketName = _awsConfig.BucketName,
            Key = $"{ProductImages}/{id}"
        };

        return await _s3.DeleteObjectAsync(deleteObjectRequest);
    }
}