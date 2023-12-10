using API.Data;
using API.DTOs.Requests;
using API.DTOs.Responses;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly StoreContext _storeContext;
    private readonly IMapper _mapper;
    private readonly IImageService _imageService;

    public ProductsController(StoreContext storeContext, IMapper mapper, IImageService imageService)
    {
        _storeContext = storeContext;
        _mapper = mapper;
        _imageService = imageService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<Product>>> GetProducts([FromQuery] ProductParams productParams)
    {
        var query = _storeContext.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Categories)
            .AsNoTracking()
            .AsQueryable();

        var products = await PagedList<Product>
            .ToPagedList(query, productParams.PageNumber, productParams.PageSize);

        // Response.AddPaginationHeader(products.MetaData);

        return new PagedResponse<Product>
        {
            Pagination = products.MetaData,
            Results = products
        };
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _storeContext.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Where(p => p.Id == id)
            .AsNoTracking()
            .FirstOrDefaultAsync();
        return product == null ? NotFound() : product;
    }

    [Authorize(Roles = "Super,Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await _storeContext.Products.FindAsync(id);
        if (product == null) return NotFound();

        _storeContext.Products.Remove(product);
        await _storeContext.SaveChangesAsync();
        await _imageService.DeleteImageAsync(product.Id, ImageFolders.ProductImages);

        return NoContent();
    }

    [Authorize(Roles = "Super,Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
    {
        var product = _mapper.Map<Product>(productDto);
        product.AverageRating = 0;
        product.NumOfRatings = 0;
        await _storeContext.Products.AddAsync(product);
        var result = await _storeContext.SaveChangesAsync();

        if (result <= 0)
            return BadRequest(new ProblemDetails { Title = "Problem creating new product" });

        if (productDto.Picture != null)
            await _imageService.UploadImageAsync(product.Id, productDto.Picture, ImageFolders.ProductImages);

        return CreatedAtAction(nameof(GetProduct), new { product.Id }, product);
    }

    [Authorize(Roles = "Super,Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, [FromForm] CreateProductDto dto)
    {
        var product = await _storeContext.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.Name = dto.Name;
        product.Sku = dto.Sku;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.QuantityInStock = dto.QuantityInStock;
        product.CategoryId = dto.CategoryId;
        product.BrandId = dto.BrandId;

        _storeContext.Entry(product).State = EntityState.Modified;

        var updates = await _storeContext.SaveChangesAsync();
        if (updates > 0)
        {
            if (dto.Picture != null)
                await _imageService.UploadImageAsync(id, dto.Picture, ImageFolders.ProductImages);

            return product;
        }

        return BadRequest();
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