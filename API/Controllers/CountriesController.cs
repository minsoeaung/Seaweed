using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CountriesController : ControllerBase
{
    private readonly StoreContext _storeContext;

    public CountriesController(StoreContext storeContext)
    {
        _storeContext = storeContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
    {
        return await _storeContext.Countries.ToListAsync();
    }
}