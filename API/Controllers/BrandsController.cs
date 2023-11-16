using System.ComponentModel.DataAnnotations;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize(Roles = "Super,Admin")]
[ApiController]
[Route("api/[controller]")]
public class BrandsController : ControllerBase
{
    private readonly StoreContext _storeContext;

    public BrandsController(StoreContext storeContext)
    {
        _storeContext = storeContext;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Brand>>> GetBrands()
    {
        return await _storeContext.Brands.AsNoTracking().ToListAsync();
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<Brand>> GetBrand(int id)
    {
        var brand = await _storeContext.Brands.FindAsync(id);
        return brand == null ? NotFound() : brand;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Brand>> DeleteBrand(int id)
    {
        var brand = await _storeContext.Brands.FindAsync(id);
        if (brand == null) return NotFound();

        _storeContext.Brands.Remove(brand);
        await _storeContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Brand>> UpdateBrand(int id, [Required] string name)
    {
        var brand = await _storeContext.Brands.FindAsync(id);
        if (brand == null) return NotFound();

        brand.Name = name;
        _storeContext.Brands.Update(brand);
        await _storeContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost]
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