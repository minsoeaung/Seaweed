using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace API.Entities;

[PrimaryKey(nameof(UserId), nameof(ProductId))]
public class ProductReview
{
    public int UserId { get; set; }
    public int ProductId { get; set; }

    [Required] [Range(1, 5)] public int Rating { get; set; }
    [Required] [MaxLength(500)] public string Review { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Product Product { get; set; }
    public User User { get; set; }
}