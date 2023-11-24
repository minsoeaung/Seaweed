using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Requests;

public class CreateReviewDto
{
    [Required] [Range(1, 5)] public int Rating { get; set; }
    [Required] [MaxLength(500)] public string Review { get; set; }
    [Required] public int ProductId { get; set; }
}