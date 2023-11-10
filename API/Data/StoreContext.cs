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
        builder.Entity<User>()
            .OwnsOne<RefreshToken>(u => u.RefreshToken, ownedNavigationBuilder =>
            {
                ownedNavigationBuilder
                    .HasIndex(r => r.Token)
                    .IsUnique();
            });

        builder.Entity<Brand>()
            .HasIndex(b => b.Name)
            .IsUnique();

        builder.Entity<Category>()
            .HasIndex(b => b.Name)
            .IsUnique();

        builder.Entity<WishList>()
            .HasKey(nameof(WishList.UserId), nameof(WishList.ProductId));

        base.OnModelCreating(builder);
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<WishList> WishLists => Set<WishList>();
}