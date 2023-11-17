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
public class CategoriesController : ControllerBase
{
    private readonly StoreContext _storeContext;
    private readonly IImageService _imageService;

    public CategoriesController(StoreContext storeContext, IImageService imageService)
    {
        _storeContext = storeContext;
        _imageService = imageService;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        return await _storeContext.Categories.AsNoTracking().ToListAsync();
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        var category = await _storeContext.Categories.FindAsync(id);
        return category == null ? NotFound() : category;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        var category = await _storeContext.Categories.FindAsync(id);
        if (category == null) return NotFound();

        _storeContext.Categories.Remove(category);

        // Intentionally leave out successfulness of below two actions 
        await _storeContext.SaveChangesAsync();
        await _imageService.DeleteImageAsync(id, ImageFolders.CategoryImages);

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Category>> UpdateCategory(int id, [FromForm] UpdateCategoryDto dto)
    {
        var category = await _storeContext.Categories.FindAsync(id);
        if (category == null) return NotFound();

        category.Name = dto.Name;
        _storeContext.Categories.Update(category);
        await _storeContext.SaveChangesAsync();

        if (dto.Picture != null)
            await _imageService.UploadImageAsync(id, dto.Picture, ImageFolders.CategoryImages);

        return category;
    }

    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory([FromForm] CreateCategoryDto dto)
    {
        var existing = await _storeContext.Categories.FirstOrDefaultAsync(c => c.Name == dto.Name);
        if (existing != null)
            return BadRequest();

        var category = new Category { Name = dto.Name };

        await _storeContext.Categories.AddAsync(category);
        await _storeContext.SaveChangesAsync();
        await _imageService.UploadImageAsync(category.Id, dto.Picture, ImageFolders.CategoryImages);

        return category;
    }
}