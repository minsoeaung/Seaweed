namespace API.DTOs.Requests;

public class UpdateCategoryDto
{
    public string Name { get; set; }
    public IFormFile? Picture { get; set; }
}