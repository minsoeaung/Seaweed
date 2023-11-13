using API.Entities;

namespace API.Extensions;

public static class ProductExtensions
{
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
    {
        query = orderBy switch
        {
            "price" => query.OrderBy(p => p.Price),
            "priceDesc" => query.OrderByDescending(p => p.Price),
            "name" => query.OrderBy(p => p.Name),
            "nameDesc" => query.OrderByDescending(p => p.Name),
            _ => query.OrderByDescending(p => p.Id)
        };

        return query;
    }

    public static IQueryable<Product> Search(this IQueryable<Product> query, string? searchTerm)
    {
        return string.IsNullOrWhiteSpace(searchTerm)
            ? query
            : query.Where(p => p.Name.ToLower().Contains(searchTerm.Trim().ToLower()));
    }

    public static IQueryable<Product> Filter(this IQueryable<Product> query, string? brands, string? categories)
    {
        var brandList = new List<string>();
        var categoryList = new List<string>();

        if (!string.IsNullOrWhiteSpace(brands))
            brandList.AddRange(brands.Trim().ToLower().Split(",").ToList());

        if (!string.IsNullOrWhiteSpace(categories))
            categoryList.AddRange(categories.Trim().ToLower().Split(",").ToList());

        query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.Name.ToLower()));
        query = query.Where(p => categoryList.Count == 0 || categoryList.Contains(p.Category.Name.ToLower()));

        return query;
    }
}