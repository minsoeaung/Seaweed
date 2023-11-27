namespace API.DTOs.Requests;

public class UpdateAddressDto : CreateAddressDto
{
    public bool IsDefault { get; set; }
}