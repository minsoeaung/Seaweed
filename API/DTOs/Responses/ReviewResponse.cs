namespace API.DTOs.Responses;

public class ReviewResponse
{
    public int ProductId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }
    public string UserProfilePicture { get; set; }

    public int Rating { get; set; }
    public string Review { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}