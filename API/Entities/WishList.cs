namespace API.Entities;

public class WishList
{
    public int UserId { get; set; }
    public int ProductId { get; set; }

    public Product Product { get; set; }
}