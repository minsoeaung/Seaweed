using API.Entities;
using Bogus;

namespace API.Data;

public static class Seeders
{
    private static List<Brand> Brands { get; set; }
    private static List<Category> Categories { get; set; }
    private static List<Product> Products { get; set; }

    public static void Seed(StoreContext context)
    {
        if (!context.Products.Any())
        {
            const int productNumToSeed = 100;
            const int brandNumToSeed = 20;
            const int categoryNumToSeed = 30;

            var brandIds = 1;
            var brandFaker = new Faker<Brand>()
                .StrictMode(true)
                .UseSeed(1111)
                .RuleFor(d => d.Id, f => brandIds++)
                .RuleFor(d => d.Name, f => f.Company.CompanyName());
            Brands = brandFaker.Generate(brandNumToSeed);

            var categoryIds = 1;
            var categoryFaker = new Faker<Category>()
                .StrictMode(true)
                .UseSeed(5555)
                .RuleFor(d => d.Id, f => categoryIds++)
                .RuleFor(d => d.Name, f => f.Commerce.Product());
            Categories = categoryFaker.Generate(categoryNumToSeed);

            var productIds = 1;
            var productFaker = new Faker<Product>()
                .StrictMode(false)
                .UseSeed(7777)
                .RuleFor(d => d.Id, f => productIds++)
                .RuleFor(p => p.Name, f => f.Commerce.ProductName())
                .RuleFor(p => p.Price, f => f.Random.Number(20, 200))
                .RuleFor(p => p.Sku, f => $"ABC-{f.Random.Number(1000, 9999)}-X-XX")
                .RuleFor(p => p.Description, f => f.Commerce.ProductDescription())
                .RuleFor(p => p.QuantityInStock, f => f.Random.Number(0, 200))
                .RuleFor(p => p.BrandId, f => f.PickRandom(Brands).Id)
                .RuleFor(p => p.CategoryId, f => f.PickRandom(Categories).Id);
            Products = productFaker.Generate(productNumToSeed);

            context.Brands.AddRange(Brands);
            context.Categories.AddRange(Categories);
            context.Products.AddRange(Products);
            context.SaveChanges();
        }
    }
}