using API.Data;
using API.DTOs.Requests;
using API.Entities;
using API.Services;
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
    private readonly IImageService _imageService;

    public BrandsController(StoreContext storeContext, IImageService imageService)
    {
        _storeContext = storeContext;
        _imageService = imageService;
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
    public async Task<ActionResult> DeleteBrand(int id)
    {
        var brand = await _storeContext.Brands.FindAsync(id);
        if (brand == null) return NotFound();

        _storeContext.Brands.Remove(brand);

        await _storeContext.SaveChangesAsync();
        await _imageService.DeleteImageAsync(id, ImageFolders.BrandImages);

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Brand>> UpdateBrand(int id, [FromForm] UpdateBrandDto dto)
    {
        var brand = await _storeContext.Brands.FindAsync(id);
        if (brand == null) return NotFound();

        brand.Name = dto.Name;
        _storeContext.Brands.Update(brand);
        await _storeContext.SaveChangesAsync();

        if (dto.Picture != null)
            await _imageService.UploadImageAsync(id, dto.Picture, ImageFolders.BrandImages);

        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult<Brand>> CreateBrand([FromForm] CreateBrandDto dto)
    {
        var existing = await _storeContext.Brands.FirstOrDefaultAsync(c => c.Name == dto.Name);
        if (existing != null)
            return BadRequest();

        var brand = new Brand { Name = dto.Name };

        await _storeContext.Brands.AddAsync(brand);
        await _storeContext.SaveChangesAsync();
        await _imageService.UploadImageAsync(brand.Id, dto.Picture, ImageFolders.BrandImages);

        return brand;
    }
}