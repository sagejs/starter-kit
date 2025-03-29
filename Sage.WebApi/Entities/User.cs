using Microsoft.EntityFrameworkCore;

namespace Sage.WebApi.Entities;

[Index(nameof(Email), IsUnique = true)]
public class User
{
  public Guid Id { get; set; }
  public string? Name { get; set; }
  public string? Image { get; set; }
  public required string Email { get; set; }

  #region Navigations

  public ICollection<Account> Accounts { get; set; }

  #endregion
}
