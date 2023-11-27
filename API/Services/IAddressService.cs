using API.Entities;

namespace API.Services;

public interface IAddressService
{
    Task<UserAddress> GetUserAddress(int userId, int addressId = 0);

    Task<Address?> UpdateAddress(int addressId, string unitNumber, string streetNumber, string addrLine1,
        string addrLine2, string postalCodes, string city, string region, int countryId);

    Task<Address?> AddAddress(int userId, string unitNumber, string streetNumber, string addrLine1,
        string addrLine2, string postalCodes, string city, string region, int countryId);

    Task DeleteAddress(int userId, int addressId);

    Task<UserAddress?> UpdateDefaultAddress(int userId, int newDefaultAddressId);
}