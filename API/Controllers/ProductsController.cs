using System.ComponentModel.DataAnnotations;
using API.Data;
using API.DTOs.Requests;
using API.DTOs.Responses;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
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

    public ProductsController(StoreContext storeContext, IMapper mapper)
    {
        _storeContext = storeContext;
        _mapper = mapper;
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
            .FirstOrDefaultAsync();
        return product == null ? NotFound() : product;
    }

    [Authorize(Roles = "Super,Admin")]
    [HttpPost]
    public async Task<ActionResult> CreateProduct([FromForm] CreateProductDto productDto)
    {
        var product = _mapper.Map<Product>(productDto);
        await _storeContext.Products.AddAsync(product);
        var result = await _storeContext.SaveChangesAsync();
        if (result > 0)
            return CreatedAtAction(nameof(GetProduct), new { product.Id }, product);

        return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
    }

    [Authorize(Roles = "Super,Admin")]
    [HttpDelete]
    public async Task<ActionResult> DeleteProduct(int productId)
    {
        var productToDelete = await _storeContext.Products.FindAsync(productId);
        if (productToDelete == null)
            return NotFound();

        _storeContext.Products.Remove(productToDelete);
        await _storeContext.SaveChangesAsync();

        return NoContent();
    }


    [HttpGet("filters")]
    public async Task<ActionResult<ProductFilters>> GetFilters()
    {
        return new ProductFilters
        {
            Brands = await _storeContext.Brands.AsNoTracking().ToListAsync(),
            Categories = await _storeContext.Categories.AsNoTracking().ToListAsync()
        };
    }

    [HttpGet("categories/{id}")]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        var category = await _storeContext.Categories.FindAsync(id);
        return category == null ? NotFound() : category;
    }

    [HttpDelete("categories/{id}")]
    public async Task<ActionResult<Category>> DeleteCategory(int id)
    {
        var category = await _storeContext.Categories.FindAsync(id);
        if (category == null) return NotFound();

        _storeContext.Categories.Remove(category);
        await _storeContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("categories/{id}")]
    public async Task<ActionResult<Category>> UpdateCategory(int id, [Required] string name)
    {
        var category = await _storeContext.Categories.FindAsync(id);
        if (category == null) return NotFound();

        category.Name = name;
        _storeContext.Categories.Update(category);
        await _storeContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("categories")]
    public async Task<ActionResult<Category>> CreateCategory([Required] string name)
    {
        var existing = await _storeContext.Categories.FirstOrDefaultAsync(c => c.Name == name);
        if (existing != null)
            return BadRequest();

        var category = new Category { Name = name };

        await _storeContext.Categories.AddAsync(category);
        await _storeContext.SaveChangesAsync();

        return category;
    }

    [HttpGet("brands/{id}")]
    public async Task<ActionResult<Brand>> GetBrand(int id)
    {
        var brand = await _storeContext.Brands.FindAsync(id);
        return brand == null ? NotFound() : brand;
    }

    [HttpDelete("brands/{id}")]
    public async Task<ActionResult<Brand>> DeleteBrand(int id)
    {
        var brand = await _storeContext.Brands.FindAsync(id);
        if (brand == null) return NotFound();

        _storeContext.Brands.Remove(brand);
        await _storeContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("brands/{id}")]
    public async Task<ActionResult<Brand>> UpdateBrand(int id, [Required] string name)
    {
        var brand = await _storeContext.Brands.FindAsync(id);
        if (brand == null) return NotFound();

        brand.Name = name;
        _storeContext.Brands.Update(brand);
        await _storeContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("brands")]
    public async Task<ActionResult<Brand>> CreateBrand([Required] string name)
    {
        var existing = await _storeContext.Brands.FirstOrDefaultAsync(c => c.Name == name);
        if (existing != null)
            return BadRequest();

        var brand = new Brand { Name = name };

        await _storeContext.Brands.AddAsync(brand);
        await _storeContext.SaveChangesAsync();

        return brand;
    }
}