using API.Data;
using API.DTOs.Requests;
using API.DTOs.Responses;
using API.Entities;
using API.RequestHelpers;
using API.Services;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : BaseApiController
{
    private readonly StoreContext _storeContext;
    private readonly IMapper _mapper;
    private readonly IImageService _imageService;
    private readonly IProductService _productService;

    public ProductsController(StoreContext storeContext,
        IMapper mapper,
        IImageService imageService,
        IProductService productService)
    {
        _storeContext = storeContext;
        _mapper = mapper;
        _imageService = imageService;
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<Product>>> GetProducts([FromQuery] ProductParams productParams)
    {
        var errorOrPagedProduct = await _productService.GetPaginatedProducts(productParams);

        return errorOrPagedProduct.Match(
            pagedProduct => Ok(new PagedResponse<Product>
            {
                Pagination = pagedProduct.MetaData,
                Results = pagedProduct
            }),
            Problem
        );

        // Response.AddPaginationHeader(products.MetaData);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var errorOrProduct = await _productService.GetProduct(id);
        return errorOrProduct.Match(Ok, Problem);
    }

    [Authorize(Roles = "Super,Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var errorOrDeleted = await _productService.DeleteProduct(id);
        return errorOrDeleted.Match(_ => NoContent(), Problem);
    }

    [Authorize(Roles = "Super,Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto dto)
    {
        var errorOrProduct = await _productService.AddProduct(dto.Name, dto.Sku, dto.Description,
            dto.Price, dto.QuantityInStock, dto.CategoryId, dto.BrandId,
            dto.Picture);

        return errorOrProduct.Match(product => CreatedAtAction(nameof(GetProduct), new { product.Id }, product),
            Problem);
    }

    [Authorize(Roles = "Super,Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, [FromForm] CreateProductDto dto)
    {
        var errorOrProduct = await _productService.UpdateProduct(id, dto.Name, dto.Sku, dto.Description,
            dto.Price, dto.QuantityInStock, dto.CategoryId, dto.BrandId,
            dto.Picture);

        return errorOrProduct.Match(Ok, Problem);
    }

    [HttpGet("filters")]
    public async Task<ActionResult<ProductFilters>> GetFilters()
    {
        return new ProductFilters
        {
            Brands = await _storeContext.Products.Select(p => p.Brand).Distinct().AsNoTracking().ToListAsync(),
            Categories = await _storeContext.Products.Select(p => p.Category).Distinct().AsNoTracking().ToListAsync()
        };
    }
}