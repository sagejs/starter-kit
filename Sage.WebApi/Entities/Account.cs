using System;
using Microsoft.EntityFrameworkCore;

namespace Sage.WebApi.Entities;

[Index(nameof(UserId))]
[Index(nameof(Provider), nameof(ProviderAccountId), IsUnique = true)]
public class Account
{
  public Guid Id { get; set; }

  public required string Provider { get; set; }
  public required string ProviderAccountId { get; set; }

  #region Navigations

  public Guid UserId { get; set; }
  public User User { get; set; }

  #endregion
}
