using System.Security.Claims;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[ApiController]
[Route("api/[controller]")]
public class WishListController : ControllerBase
{
    private readonly StoreContext _storeContext;

    public WishListController(StoreContext storeContext)
    {
        _storeContext = storeContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WishList>>> GetWishList()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return BadRequest();

        return await _storeContext.WishLists
            .Where(w => w.UserId == int.Parse(userId))
            .Include(w => w.Product)
            .ThenInclude(p => p.Brand)
            .AsNoTracking()
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult> AddToWishList(int productId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return BadRequest();

        var product = await _storeContext.Products.FindAsync(productId);
        if (product is null)
            return NotFound();

        var wishList = new WishList
        {
            UserId = int.Parse(userId),
            ProductId = product.Id,
            Product = product
        };

        await _storeContext.WishLists.AddAsync(wishList);
        await _storeContext.SaveChangesAsync();
        return Ok();
    }


    [HttpDelete]
    public async Task<ActionResult> RemoveFromWithList(int productId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return BadRequest();

        var product = await _storeContext.Products.FindAsync(productId);
        if (product is null)
            return NotFound();

        var wishList = new WishList
        {
            UserId = int.Parse(userId),
            ProductId = product.Id,
            Product = product
        };

        _storeContext.WishLists.Remove(wishList);
        await _storeContext.SaveChangesAsync();
        return Ok();
    }
}