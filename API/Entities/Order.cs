namespace API.Entities;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public double Total { get; set; }
    public DateTime CreatedAt { get; set; }
    public OrderAddress OrderAddress { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}