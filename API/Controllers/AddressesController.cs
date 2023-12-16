using System.Security.Claims;
using API.DTOs.Requests;
using API.DTOs.Responses;
using API.Services;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[ApiController]
[Route("api/[controller]")]
public class AddressesController : BaseApiController
{
    private readonly IAddressService _service;
    private readonly IMapper _mapper;

    public AddressesController(IAddressService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AddressDetails?>> GetAddress(int id)
    {
        var userAddress = await _service.GetUserAddressAsync(GetUserId(), id);
        var address = userAddress.Addresses.FirstOrDefault();
        if (address == null)
            return NotFound();

        var addressDetails = _mapper.Map<AddressDetails>(address);
        addressDetails.IsDefault = userAddress.DefaultAddressId == addressDetails.Id;

        return addressDetails;
    }


    [HttpGet]
    public async Task<IEnumerable<AddressDetails>> GetAddresses()
    {
        var userAddress = await _service.GetUserAddressAsync(GetUserId());
        var addresses = userAddress.Addresses;

        var addressDetailsList = _mapper.Map<IEnumerable<AddressDetails>>(addresses.AsEnumerable()).ToList();
        foreach (var address in addressDetailsList.Where(address => address.Id == userAddress.DefaultAddressId))
        {
            address.IsDefault = true;
            break;
        }

        return addressDetailsList;
    }

    [HttpPost]
    public async Task<ActionResult<AddressDetails>> AddAddress(CreateAddressDto dto)
    {
        var addressOrError = await _service.AddAddressAsync(
            GetUserId(),
            dto.UnitNumber,
            dto.StreetNumber,
            dto.AddressLine1,
            dto.AddressLine2,
            dto.PostalCodes,
            dto.City,
            dto.Region,
            dto.CountryId
        );

        return addressOrError.Match(
            address => CreatedAtAction(nameof(GetAddress), new { address.Id },
                _mapper.Map<AddressDetails>(address)),
            Problem
        );
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AddressDetails>> UpdateAddress(int id, UpdateAddressDto dto)
    {
        var addressOrError = await _service.UpdateAddressAsync(
            id,
            dto.UnitNumber,
            dto.StreetNumber,
            dto.AddressLine1,
            dto.AddressLine2,
            dto.PostalCodes,
            dto.City,
            dto.Region,
            dto.CountryId
        );

        if (addressOrError.IsError)
            return Problem(addressOrError.Errors);

        var addressDetails = _mapper.Map<AddressDetails>(addressOrError.Value);
        addressDetails.IsDefault = dto.IsDefault;
        return addressDetails;
    }


    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAddress(int id)
    {
        await _service.DeleteAddressAsync(GetUserId(), id);
        return NoContent();
    }

    [HttpPut("change-default-address")]
    public async Task<ActionResult> UpdateDefaultAddress(int id)
    {
        var userAddress = await _service.UpdateDefaultAddressAsync(GetUserId(), id);
        return userAddress == null ? NotFound() : NoContent();
    }

    private int GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        int.TryParse(userId, out int validUserId);

        return validUserId;
    }
}