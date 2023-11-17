namespace API.DTOs.Requests;

public class CreateCategoryDto
{
    public string Name { get; set; }
    public IFormFile Picture { get; set; }
}