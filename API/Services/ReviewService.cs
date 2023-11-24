using API.Data;
using API.Entities;
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

    public async Task<IEnumerable<ProductReview>> GetReviewsExceptOwnedByUserId(int userId, int productId)
    {
        return await _context.ProductReviews
            .Include(r => r.User)
            .Where(r => r.ProductId == productId && r.UserId != userId)
            .OrderBy(r => r.UpdatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<ProductReview?> GetReview(int userId, int productId)
    {
        return await _context.ProductReviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == productId);
    }

    public async Task<ProductReview?> CreateOrUpdateReview(int userId, int productId, int rating, string reviewComment)
    {
        var existingReview = await GetReview(userId, productId);
        if (existingReview != null)
        {
            existingReview.Review = reviewComment;
            existingReview.Rating = rating;
            _context.ProductReviews.Update(existingReview);
            await _context.SaveChangesAsync();
            return existingReview;
        }

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return null;

        var newReview = new ProductReview
        {
            UserId = userId,
            User = user,
            ProductId = productId,
            Rating = rating,
            Review = reviewComment,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await _context.ProductReviews.AddAsync(newReview);
        await _context.SaveChangesAsync();

        return newReview;
    }

    public async Task DeleteReview(int userId, int productId)
    {
        var review = await GetReview(userId, productId);

        if (review == null) return;

        _context.ProductReviews.Remove(review);
        await _context.SaveChangesAsync();
    }
}