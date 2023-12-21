using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext : IdentityDbContext<User, UserRole, int>
{
    public StoreContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<UserSession>()
            .HasIndex(u => u.RefreshToken)
            .IsUnique();

        builder.Entity<Brand>()
            .HasIndex(b => b.Name)
            .IsUnique();

        builder.Entity<Category>()
            .HasIndex(b => b.Name)
            .IsUnique();

        builder.Entity<WishList>()
            .HasKey(nameof(WishList.UserId), nameof(WishList.ProductId));

        builder.Entity<ProductReview>()
            .HasOne(pr => pr.Product)
            .WithMany()
            .HasForeignKey(p => p.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ProductReview>()
            .HasOne(u => u.User)
            .WithMany()
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        base.OnModelCreating(builder);
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<WishList> WishLists => Set<WishList>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<UserSession> UserSessions => Set<UserSession>();
    public DbSet<ProductReview> ProductReviews => Set<ProductReview>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<UserAddress> UserAddresses => Set<UserAddress>();
    public DbSet<Country> Countries => Set<Country>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<OrderAddress> OrderAddresses => Set<OrderAddress>();
    // public DbSet<ProductReviewSummary> ProductReviewSummaries => Set<ProductReviewSummary>();
}