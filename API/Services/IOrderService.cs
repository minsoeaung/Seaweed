using API.Entities;

namespace API.Services;

public interface IOrderService
{
    Task CreateOrder(int userId, int addressId);
    Task<IEnumerable<Order>> GetOrders(int userId);
}