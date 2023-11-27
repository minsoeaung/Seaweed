using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class AddressService : IAddressService
{
    private readonly StoreContext _context;

    public AddressService(StoreContext context)
    {
        _context = context;
    }

    public async Task<UserAddress> GetUserAddress(int userId, int addressId)
    {
        var userAddress = await _context.UserAddresses
            .Include(u => u.Addresses.Where(a => addressId == 0 || a.Id == addressId))
            .ThenInclude(a => a.Country)
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (userAddress == null)
        {
            return new UserAddress
            {
                Addresses = new List<Address>(),
                UserId = userId,
                DefaultAddressId = 0
            };
        }

        return userAddress;
    }

    public async Task<Address?> UpdateAddress(int addressId, string unitNumber, string streetNumber,
        string addrLine1,
        string addrLine2,
        string postalCodes, string city, string region, int countryId)
    {
        var address = await _context.Addresses.FindAsync(addressId);
        if (address == null)
            return null;

        var country = await _context.Countries.FindAsync(countryId);
        if (country == null)
            return null;

        address.UnitNumber = unitNumber;
        address.StreetNumber = streetNumber;
        address.AddressLine1 = addrLine1;
        address.AddressLine2 = addrLine2;
        address.PostalCodes = postalCodes;
        address.City = city;
        address.Region = region;
        address.CountryId = countryId;

        _context.Addresses.Update(address);
        await _context.SaveChangesAsync();
        return address;
    }

    public async Task<Address?> AddAddress(int userId, string unitNumber, string streetNumber, string addrLine1,
        string addrLine2,
        string postalCodes, string city, string region, int countryId)
    {
        var country = await _context.Countries.FindAsync(countryId);
        if (country == null)
            return null;

        var userAddress = await _context.UserAddresses
            .AsNoTracking()
            .FirstOrDefaultAsync(ua => ua.UserId == userId);
        if (userAddress == null)
        {
            userAddress = new UserAddress
            {
                UserId = userId,
                DefaultAddressId = 0,
                Addresses = new List<Address>()
            };
            await _context.UserAddresses.AddAsync(userAddress);
            await _context.SaveChangesAsync();
        }

        var address = new Address
        {
            UserAddressId = userAddress.Id,
            UnitNumber = unitNumber,
            StreetNumber = streetNumber,
            AddressLine1 = addrLine1,
            AddressLine2 = addrLine2,
            PostalCodes = postalCodes,
            City = city,
            Region = region,
            CountryId = countryId,
            Country = country
        };

        try
        {
            await _context.Addresses.AddAsync(address);
            var updates = await _context.SaveChangesAsync();

            return updates > 0 ? address : null;
        }
        catch
        {
            return null;
        }
    }

    public async Task DeleteAddress(int userId, int addressId)
    {
        var addressToDelete = await _context.Addresses.FindAsync(addressId);
        if (addressToDelete == null) return;

        var userAddress = await _context.UserAddresses.FirstOrDefaultAsync(ua => ua.UserId == userId);
        if (userAddress == null) return;

        if (userAddress.DefaultAddressId == addressToDelete.Id)
        {
            userAddress.DefaultAddressId = 0;
            _context.UserAddresses.Update(userAddress);
        }

        _context.Addresses.Remove(addressToDelete);

        await _context.SaveChangesAsync();
    }

    public async Task<UserAddress?> UpdateDefaultAddress(int userId, int newDefaultAddressId)
    {
        var userAddress = await _context.UserAddresses.AsNoTracking().FirstOrDefaultAsync(ua => ua.UserId == userId);
        if (userAddress == null)
            return null;

        var address = await _context.Addresses.FindAsync(newDefaultAddressId);
        if (address == null)
            return null;

        userAddress.DefaultAddressId = address.Id;

        _context.UserAddresses.Update(userAddress);
        await _context.SaveChangesAsync();

        return userAddress;
    }
}