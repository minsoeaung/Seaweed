using API.Entities;

namespace API.DTOs.Responses;

public class ProductFilters
{
    public List<Brand> Brands { get; set; }
    public List<Category> Categories { get; set; }
}