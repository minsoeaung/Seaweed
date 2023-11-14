using System.ComponentModel.DataAnnotations;

namespace API.DTOs.Requests;

public class ProductUpdateDto
{
    [Required] public string Name { get; set; }
    [MaxLength(100)] public string Sku { get; set; }
    public string Description { get; set; }
    public double Price { get; set; }
    public int QuantityInStock { get; set; }
    public int CategoryId { get; set; }
    public int BrandId { get; set; }
}