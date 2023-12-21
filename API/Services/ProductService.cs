using API.ApiErrors;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using ErrorOr;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class ProductService : IProductService
{
    private readonly StoreContext _storeContext;
    private readonly IImageService _imageService;

    public ProductService(StoreContext storeContext, IImageService imageService)
    {
        _storeContext = storeContext;
        _imageService = imageService;
    }

    public async Task<ErrorOr<PagedList<Product>>> GetPaginatedProducts(ProductParams productParams)
    {
        var query = _storeContext.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Categories)
            .AsNoTracking()
            .AsQueryable();

        return await PagedList<Product>
            .ToPagedList(query, productParams.PageNumber, productParams.PageSize);
    }

    public async Task<ErrorOr<Product>> GetProduct(int productId)
    {
        var product = await _storeContext.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Where(p => p.Id == productId)
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (product == null)
            return Errors.Product.NotFound;

        return product;
    }

    public async Task<ErrorOr<Deleted>> DeleteProduct(int productId)
    {
        var product = await _storeContext.Products.FindAsync(productId);

        if (product == null)
            return Errors.Product.NotFound;

        _storeContext.Products.Remove(product);
        await _storeContext.SaveChangesAsync();

        await _imageService.DeleteImageAsync(product.Id, ImageFolders.ProductImages);

        return Result.Deleted;
    }

    public async Task<ErrorOr<Product>> AddProduct(string name,
        string sku,
        string description,
        double price,
        int stock,
        int categoryId,
        int brandId,
        IFormFile? picture)
    {
        var product = new Product
        {
            Name = name,
            Sku = sku,
            Description = description,
            Price = price,
            QuantityInStock = stock,
            CategoryId = categoryId,
            BrandId = brandId,
        };

        await _storeContext.Products.AddAsync(product);

        var addResult = await _storeContext.SaveChangesAsync();

        if (addResult <= 0)
            return Errors.Product.AddFailure;

        if (picture != null)
            await _imageService.UploadImageAsync(product.Id, picture, ImageFolders.ProductImages);

        return product;
    }

    public async Task<ErrorOr<Product>> UpdateProduct(int productId,
        string name,
        string sku,
        string description,
        double price,
        int stock,
        int categoryId,
        int brandId,
        IFormFile? picture)
    {
        var product = await _storeContext.Products.FindAsync(productId);
        if (product == null)
            return Errors.Product.NotFound;

        product.Name = name;
        product.Sku = sku;
        product.Description = description;
        product.Price = price;
        product.QuantityInStock = stock;
        product.CategoryId = categoryId;
        product.BrandId = brandId;

        _storeContext.Products.Update(product);

        var updateResult = await _storeContext.SaveChangesAsync();

        if (updateResult <= 0)
            return Errors.Product.UpdateFailure;

        if (picture != null)
            await _imageService.UploadImageAsync(productId, picture, ImageFolders.ProductImages);

        return product;
    }
}