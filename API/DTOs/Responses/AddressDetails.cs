using API.Entities;

namespace API.DTOs.Responses;

public class AddressDetails
{
    public int Id { get; set; }
    public string UnitNumber { get; set; } = string.Empty;
    public string StreetNumber { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string AddressLine2 { get; set; } = string.Empty;
    public string PostalCodes { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public Country Country { get; set; }
    public bool IsDefault { get; set; }
}