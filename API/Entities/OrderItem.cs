namespace API.Entities;

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }

    public double Total { get; set; }
    public int Quantity { get; set; }

    public int? ProductId { get; set; }
    public Product? Product { get; set; }
}