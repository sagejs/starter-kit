namespace Sage.WebApi.Entities;

public class VerificationToken
{
  public required string Id { get; set; }
  public required byte[] Token { get; set; }
  public required DateTime Expires { get; set; }
  public int Attempts { get; set; } = 0;
}
