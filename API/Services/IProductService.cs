using API.Entities;
using API.RequestHelpers;
using ErrorOr;

namespace API.Services;

public interface IProductService
{
    Task<ErrorOr<PagedList<Product>>> GetPaginatedProducts(ProductParams productParams);

    Task<ErrorOr<Product>> GetProduct(int productId);

    Task<ErrorOr<Deleted>> DeleteProduct(int productId);

    Task<ErrorOr<Product>> AddProduct(string name,
        string sku,
        string description,
        double price,
        int stock,
        int categoryId,
        int brandId,
        IFormFile? picture);

    Task<ErrorOr<Product>> UpdateProduct(int productId,
        string name,
        string sku,
        string description,
        double price,
        int stock,
        int categoryId,
        int brandId,
        IFormFile? picture);
}