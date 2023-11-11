using System.Security.Claims;
using API.DTOs.Responses;
using API.Services;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;
    private readonly IMapper _mapper;

    public CartController(ICartService cartService, IMapper mapper)
    {
        _cartService = cartService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<CartResponse>> GetCartItems()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return BadRequest();

        var cartItems = await _cartService.GetCartItemsAsync(int.Parse(userId));
        return _mapper.Map<CartResponse>(cartItems);
    }

    [HttpPost]
    public async Task<ActionResult> AddToCart(int productId, int quantity)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return BadRequest();

        await _cartService.AddToCartAsync(int.Parse(userId), productId, quantity);
        return Ok();
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveFromCart(int productId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
            return BadRequest();

        await _cartService.RemoveFromCartAsync(int.Parse(userId), productId);
        return Ok();
    }
}