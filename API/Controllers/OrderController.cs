using System.Security.Claims;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IAddressService _addressService;
    private readonly ICartService _cartService;

    public OrderController(IOrderService orderService, IAddressService addressService, ICartService cartService)
    {
        _orderService = orderService;
        _addressService = addressService;
        _cartService = cartService;
    }

    [HttpGet]
    public Task<IEnumerable<Order>> GetOrders()
    {
        return _orderService.GetOrders(GetUserId());
    }

    [HttpPost]
    public async Task<ActionResult> CreateOrder(int addressId)
    {
        await _orderService.CreateOrder(GetUserId(), addressId);
        return NoContent();
    }


    private int GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        int.TryParse(userId, out int validUserId);
        return validUserId;
    }
}