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
    public async Task<ActionResult<PagedResponse<ReviewResponse>>> GetReviews(int productId, int pageNumber = 1,
        int pageSize = 10)
    {
        var reviews = await _reviewService.GetReviews(productId, pageNumber, pageSize);

        return new PagedResponse<ReviewResponse>
        {
            Pagination = reviews.MetaData,
            Results = _mapper.Map<IEnumerable<ReviewResponse>>(reviews)
        };

        // List<ReviewResponse> reviews = new List<ReviewResponse>();
        // var faker = new Faker<ReviewResponse>();
        // faker.RuleFor(f => f.CreatedAt, DateTime.UtcNow);
        // faker.RuleFor(f => f.UpdatedAt, DateTime.UtcNow);
        // faker.RuleFor(f => f.UserId, f => f.Random.Number(100, 100000));
        // faker.RuleFor(f => f.ProductId, f => f.Random.Number(100, 100000));
        // faker.RuleFor(f => f.Rating, f => f.Random.Number(1, 5));
        // faker.RuleFor(f => f.Review, f => f.Lorem.Sentences(5));
        // faker.RuleFor(f => f.UserName, f => f.Person.UserName);
        // faker.RuleFor(f => f.UserProfilePicture, f => f.Internet.Avatar());
        // reviews = faker.Generate(28);
        //
        // var filteredReviews = reviews.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        //
        // return new PagedResponse<ReviewResponse>
        // {
        //     Pagination = new MetaData
        //     {
        //         CurrentPage = pageNumber,
        //         TotalCount = reviews.Count,
        //         TotalPages = (reviews.Count / pageSize) + ((reviews.Count % pageSize) > 0 ? 1 : 0),
        //         PageSize = pageSize
        //     },
        //     Results = filteredReviews
        // };
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