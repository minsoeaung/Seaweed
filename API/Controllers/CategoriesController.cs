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
public class CategoriesController : ControllerBase
{
    private readonly StoreContext _storeContext;

    public CategoriesController(StoreContext storeContext)
    {
        _storeContext = storeContext;
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
    public async Task<ActionResult<Category>> DeleteCategory(int id)
    {
        var category = await _storeContext.Categories.FindAsync(id);
        if (category == null) return NotFound();

        _storeContext.Categories.Remove(category);
        await _storeContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Category>> UpdateCategory(int id, [Required] string name)
    {
        var category = await _storeContext.Categories.FindAsync(id);
        if (category == null) return NotFound();

        category.Name = name;
        _storeContext.Categories.Update(category);
        await _storeContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost]
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
}