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
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;
    private readonly IMapper _mapper;

    public ReviewsController(IReviewService reviewService, IMapper mapper)
    {
        _reviewService = reviewService;
        _mapper = mapper;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReviewResponse>>> GetReviews(int productId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        int.TryParse(userId, out int validUserId);

        var reviews = await _reviewService.GetReviewsExceptOwnedByUserId(validUserId, productId);
        return Ok(_mapper.Map<IEnumerable<ReviewResponse>>(reviews));
    }


    [HttpGet("me")]
    public async Task<ActionResult<ReviewResponse?>> GetMyReview(int productId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        int.TryParse(userId, out int validUserId);

        var review = await _reviewService.GetReview(validUserId, productId);
        if (review == null)
            return NotFound();

        return _mapper.Map<ReviewResponse>(review);
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteReview(int productId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        int.TryParse(userId, out int validUserId);
        await _reviewService.DeleteReview(validUserId, productId);
        return NoContent();
    }


    [HttpPut]
    public async Task<ActionResult<ReviewResponse>> CreateOrUpdateReview(CreateReviewDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        int.TryParse(userId, out int validUserId);

        var review = await _reviewService.CreateOrUpdateReview(validUserId, dto.ProductId, dto.Rating, dto.Review);
        return review == null ? BadRequest() : _mapper.Map<ReviewResponse>(review);
    }
}