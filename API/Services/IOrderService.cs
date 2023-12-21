using API.Entities;
using ErrorOr;

namespace API.Services;

public interface IOrderService
{
    Task<ErrorOr<Created>> CreateOrder(int userId, int addressId);
    Task<IEnumerable<Order>> GetOrders(int userId);
}