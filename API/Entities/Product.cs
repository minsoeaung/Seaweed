using System.ComponentModel.DataAnnotations;

namespace API.Entities;

public class Product
{
    public int Id { get; set; }
    [Required] public string Name { get; set; }
    [MaxLength(100)] public string Sku { get; set; }
    public string Description { get; set; }
    public double Price { get; set; }
    public int QuantityInStock { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; }

    public int BrandId { get; set; }
    public Brand Brand { get; set; }
}