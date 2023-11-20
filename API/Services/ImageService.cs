using Amazon.CloudFront;
using Amazon.CloudFront.Model;
using Amazon.S3;
using Amazon.S3.Model;
using API.Configurations;
using Microsoft.Extensions.Options;

namespace API.Services;

public static class ImageFolders
{
    public const string ProductImages = "product_images";
    public const string BrandImages = "brand_images";
    public const string CategoryImages = "category_images";
    public const string UserImages = "user_images";
}

public class ImageService : IImageService
{
    private readonly IAmazonS3 _s3;
    private readonly AwsConfig _awsConfig;
    private readonly IAmazonCloudFront _cloudFront;

    public ImageService(IOptions<AwsConfig> awsConfig, IAmazonS3 s3, IAmazonCloudFront cloudFront)
    {
        _awsConfig = awsConfig.Value;
        _s3 = s3;
        _cloudFront = cloudFront;
    }


    public async Task<PutObjectResponse> UploadImageAsync(int id, IFormFile file, string folder)
    {
        var path = $"{folder}/{id}";

        var pubObjectRequest = new PutObjectRequest()
        {
            BucketName = _awsConfig.BucketName,
            Key = path,
            ContentType = file.ContentType,
            InputStream = file.OpenReadStream(), // Better than ContentBody
            Metadata =
            {
                ["x-amz-meta-originalname"] = file.FileName,
                ["x-amz-meta-extension"] = Path.GetExtension(file.FileName)
            }
        };

        await InvalidateCloudFrontCache($"/{path}");

        return await _s3.PutObjectAsync(pubObjectRequest);
    }

    public async Task<DeleteObjectResponse> DeleteImageAsync(int id, string folder)
    {
        var path = $"{folder}/{id}";

        var deleteObjectRequest = new DeleteObjectRequest
        {
            BucketName = _awsConfig.BucketName,
            Key = path
        };

        await InvalidateCloudFrontCache($"/${path}");

        return await _s3.DeleteObjectAsync(deleteObjectRequest);
    }

    private async Task InvalidateCloudFrontCache(string path)
    {
        await _cloudFront.CreateInvalidationAsync(new CreateInvalidationRequest
        {
            DistributionId = _awsConfig.DistributionId,
            InvalidationBatch = new InvalidationBatch
            {
                Paths = new Paths
                {
                    Items = new List<string> { path },
                    Quantity = 1
                },
                CallerReference = DateTime.UtcNow.Ticks.ToString()
            }
        });
    }
}