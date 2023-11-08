using API.RequestHelpers;

namespace API.DTOs.Responses;

public class PagedResponse<T>
{
    public MetaData Pagination { get; set; }
    public IEnumerable<T> Results { get; set; }
}