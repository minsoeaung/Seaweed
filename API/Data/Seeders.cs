using API.Entities;
using Bogus;
using Microsoft.AspNetCore.Identity;

namespace API.Data;

public static class Seeders
{
    private static List<Brand> Brands { get; set; }
    private static List<Category> Categories { get; set; }
    private static List<Product> Products { get; set; }

    public static async Task Seed(StoreContext context, UserManager<User> userManager)
    {
        if (!context.Roles.Any())
        {
            var super = new UserRole { Id = 1, Name = "Super", NormalizedName = "SUPER" };
            var admin = new UserRole { Id = 2, Name = "Admin", NormalizedName = "ADMIN" };
            var user = new UserRole { Id = 3, Name = "User", NormalizedName = "USER" };
            await context.Roles.AddRangeAsync(new List<UserRole> { super, admin, user });
        }

        if (!context.Users.Any())
        {
            var superUser = new User
            {
                UserName = "super",
                Email = "super@gmail.com",
                EmailConfirmed = true,
                NormalizedEmail = "SUPER@GMAIL.COM",
                NormalizedUserName = "SUPER",
            };
            await userManager.CreateAsync(superUser, "password");
            await userManager.AddToRoleAsync(superUser, "Super");
        }

        if (!context.Products.Any())
        {
            const int productNumToSeed = 75;
            const int brandNumToSeed = 12;
            const int categoryNumToSeed = 15;

            var brandIds = 1;
            var brandFaker = new Faker<Brand>()
                .StrictMode(true)
                .UseSeed(1111)
                .RuleFor(d => d.Id, f => brandIds++)
                .RuleFor(d => d.Name, f => f.Company.CompanyName() + brandIds);
            Brands = brandFaker.Generate(brandNumToSeed);

            var categoryIds = 1;
            var categoryFaker = new Faker<Category>()
                .StrictMode(true)
                .UseSeed(5555)
                .RuleFor(d => d.Id, f => categoryIds++)
                .RuleFor(d => d.Name, f => f.Commerce.Product() + categoryIds);
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

            await context.Brands.AddRangeAsync(Brands);
            await context.Categories.AddRangeAsync(Categories);
            await context.Products.AddRangeAsync(Products);
        }

        await context.SaveChangesAsync();
    }
}