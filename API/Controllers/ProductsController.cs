using API.Data;
using API.DTOs.Responses;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly StoreContext _storeContext;

    public ProductsController(StoreContext storeContext)
    {
        _storeContext = storeContext;
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