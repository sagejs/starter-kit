using Microsoft.EntityFrameworkCore;
using Sage.WebApi.Entities;

namespace Sage.WebApi.Context;

public partial class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options)
      : base(options)
  {
  }

  public DbSet<Account> Accounts { get; set; }
  public DbSet<VerificationToken> VerificationTokens { get; set; }
  public DbSet<User> Users { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    OnModelCreatingPartial(modelBuilder);
  }

  partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
