namespace API.Entities;

public class UserAddress
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public int DefaultAddressId { get; set; }
}