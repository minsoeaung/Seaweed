using API.ApiErrors;
using API.Data;
using API.Entities;
using API.RequestHelpers;
using ErrorOr;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class ReviewService : IReviewService
{
    private readonly StoreContext _context;
    private readonly UserManager<User> _userManager;

    public ReviewService(StoreContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<PagedList<ProductReview>> GetReviews(int productId, int pageNumber, int pageSize)
    {
        var query = _context.ProductReviews
            .Where(r => r.ProductId == productId)
            .Include(r => r.User)
            .OrderBy(r => r.CreatedAt)
            .AsNoTracking()
            .AsQueryable();

        return await PagedList<ProductReview>.ToPagedList(query, pageNumber, pageSize);
    }

    public async Task<ErrorOr<ProductReview>> GetReview(int userId, int productId)
    {
        var review = await _context.ProductReviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == productId);

        if (review == null)
            return Errors.ProductReview.NotFound;

        return review;
    }

    public async Task<ErrorOr<ProductReview>> CreateOrUpdateReview(int userId, int productId, int rating, string review)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return Errors.User.NotFound;

        var product = await _context.Products.FindAsync(productId);
        if (product == null)
            return Errors.Product.NotFound;

        var existingReview = await _context.ProductReviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == productId);

        if (existingReview != null)
        {
            product.UpdateRating(existingReview.Rating, rating);
            existingReview.Review = review;
            existingReview.Rating = rating;

            // Both must succeed or fail
            _context.ProductReviews.Update(existingReview);
            _context.Products.Update(product);

            await _context.SaveChangesAsync();
            return existingReview;
        }

        var newReview = new ProductReview
        {
            UserId = userId,
            User = user,
            ProductId = productId,
            Rating = rating,
            Review = review,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        product.AddNewRating(rating);

        // Both must succeed or fail
        await _context.ProductReviews.AddAsync(newReview);
        _context.Products.Update(product);

        await _context.SaveChangesAsync();
        return newReview;
    }

    public async Task<ErrorOr<Deleted>> DeleteReview(int userId, int productId)
    {
        var review = await _context.ProductReviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == productId);

        if (review == null)
            return Errors.ProductReview.NotFound;

        var product = await _context.Products.FindAsync(productId);
        if (product == null)
            return Errors.Product.NotFound;

        product.RemoveRating(review.Rating);

        // Both must succeed or fail
        _context.ProductReviews.Remove(review);
        _context.Products.Update(product);

        // SaveChanges is guaranteed to either completely succeed, or leave the database unmodified if an error occurs
        // https://learn.microsoft.com/en-us/ef/core/saving/transactions#default-transaction-behavior
        await _context.SaveChangesAsync();

        return Result.Deleted;
    }
}