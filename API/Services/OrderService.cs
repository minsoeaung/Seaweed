using API.Data;
using API.DTOs.Responses;
using API.Entities;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class OrderService : IOrderService
{
    private readonly StoreContext _context;
    private readonly IMapper _mapper;

    public OrderService(StoreContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task CreateOrder(int userId, int addressId)
    {
        var cartItems = await _context.CartItems
            .Where(c => c.UserId == userId)
            .Include(c => c.Product)
            .AsNoTracking()
            .ToListAsync();

        if (!cartItems.Any()) return;

        var address = await _context.Addresses.FindAsync(addressId);
        if (address == null) return;

        var cartDetails = _mapper.Map<CartDetails>(cartItems);

        var order = new Order
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            Total = cartDetails.Total,
            OrderAddress = _mapper.Map<OrderAddress>(address),
            OrderItems = cartDetails
                .CartItems
                .Select(
                    cartItem => new OrderItem
                    {
                        Total = cartItem.Total,
                        Quantity = cartItem.Quantity,
                        ProductId = cartItem.ProductId
                    }
                )
                .ToList()
        };

        _context.CartItems.RemoveRange(cartItems);
        _context.Orders.Add(order);

        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Order>> GetOrders(int userId)
    {
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderAddress)
            .Include(o => o.OrderItems)
            .AsNoTracking()
            .ToListAsync();

        return orders;
    }
}