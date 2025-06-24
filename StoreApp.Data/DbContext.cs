using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StoreApp.Data.Models;

namespace StoreApp.Data;

public class ApplicationDbContext : DbContext
{
    private readonly IConfiguration _configuration;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IConfiguration configuration) : base(options)
    {
        _configuration = configuration;
    }

    public DbSet<Person> People { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>(entity =>
        {
            entity.ToTable("People");
            entity.HasIndex(e => e.Email);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
        });
    }
}