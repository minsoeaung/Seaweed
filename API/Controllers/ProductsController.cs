using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
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
    public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
    {
        var query = _storeContext.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Categories)
            .AsQueryable();

        var products = await PagedList<Product>
            .ToPagedList(query, productParams.PageNumber, productParams.PageSize);

        Response.AddPaginationHeader(products.MetaData);

        return products;
    }
}