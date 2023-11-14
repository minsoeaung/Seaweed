using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Requests;

public class CreateProductDto
{
    [Required] public string Name { get; set; }
    [Required] [MaxLength(100)] public string Sku { get; set; }
    [Required] public string Description { get; set; }

    public IFormFile Picture { get; set; }
    public IEnumerable<IFormFile>? Album { get; set; }

    [Required]
    [Range(0, double.PositiveInfinity)]
    public double Price { get; set; }

    [Required] [Range(0, 500)] public int QuantityInStock { get; set; }
    [Required] public int CategoryId { get; set; }
    [Required] public int BrandId { get; set; }
}