namespace API.RequestHelpers;

public class ProductParams
{
    public string OrderBy { get; set; } = string.Empty;
    public string SearchTerm { get; set; } = string.Empty;
    public string Brands { get; set; } = string.Empty;
    public string Categories { get; set; } = string.Empty;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 25;
}