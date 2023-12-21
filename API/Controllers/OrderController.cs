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
public class OrderController : BaseApiController
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public Task<IEnumerable<Order>> GetOrders()
    {
        return _orderService.GetOrders(GetUserId());
    }

    [HttpPost]
    public async Task<ActionResult> CreateOrder(int addressId)
    {
        var errorOrCreated = await _orderService.CreateOrder(GetUserId(), addressId);
        return errorOrCreated.Match(_ => NoContent(), Problem);
    }


    private int GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        int.TryParse(userId, out int validUserId);
        return validUserId;
    }
}