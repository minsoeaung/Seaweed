using System.Security.Claims;
using API.ApiErrors;
using API.DTOs.Responses;
using API.Services;
using ErrorOr;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[ApiController]
[Route("api/[controller]")]
public class CartController : BaseApiController
{
    private readonly ICartService _cartService;
    private readonly IMapper _mapper;

    public CartController(ICartService cartService, IMapper mapper)
    {
        _cartService = cartService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<CartDetails>> GetCartItems()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Problem(new List<Error> { Errors.User.NotFound });

        var cartItems = await _cartService.GetCartItemsAsync(int.Parse(userId));
        return _mapper.Map<CartDetails>(cartItems);
    }

    [HttpPost]
    public async Task<ActionResult> AddToCart(int productId, int quantity)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return Problem(new List<Error> { Errors.User.NotFound });

        var errorOrUpdated = await _cartService.AddToCartAsync(int.Parse(userId), productId, quantity);
        return errorOrUpdated.Match(_ => Ok(), Problem);
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveFromCart(int productId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return BadRequest();

        var errorOrDeleted = await _cartService.RemoveFromCartAsync(int.Parse(userId), productId);
        return errorOrDeleted.Match(_ => NoContent(), Problem);
    }
}