using API.Entities;
using ErrorOr;

namespace API.Services;

public interface IAddressService
{
    Task<UserAddress> GetUserAddressAsync(int userId, int addressId = 0);

    Task<ErrorOr<Address>> UpdateAddressAsync(int addressId, string unitNumber, string streetNumber,
        string addrLine1,
        string addrLine2, string postalCodes, string city, string region, int countryId);

    Task<ErrorOr<Address>> AddAddressAsync(int userId, string unitNumber, string streetNumber, string addrLine1,
        string addrLine2, string postalCodes, string city, string region, int countryId);

    Task DeleteAddressAsync(int userId, int addressId);

    Task<UserAddress?> UpdateDefaultAddressAsync(int userId, int newDefaultAddressId);
}