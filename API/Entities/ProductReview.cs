using System.ComponentModel.DataAnnotations;

namespace API.Entities;

public class ProductReview
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public int ProductId { get; set; }

    [Required] [Range(1, 5)] public int Rating { get; set; }
    [Required] [MaxLength(500)] public string Review { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Product Product { get; set; }
    public User? User { get; set; }
}