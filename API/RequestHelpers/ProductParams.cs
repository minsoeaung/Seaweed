namespace API.RequestHelpers;

public class ProductParams
{
    public string? OrderBy { get; set; }
    public string? SearchTerm { get; set; }
    public string? Brands { get; set; }
    public string? Categories { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 25;
}