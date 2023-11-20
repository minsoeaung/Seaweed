namespace API.Configurations;

public class AwsConfig
{
    public string Profile { get; set; }
    public string Region { get; set; }
    public string BucketName { get; set; }
    public string DistributionDomainName { get; set; }
    public string DistributionId { get; set; }
}