namespace Sage.WebApi.Endpoints.Auth.Verify.Post;

sealed class Response
{
  public Guid Id { get; set; }
  public string? Name { get; set; }
  public string? Image { get; set; }
  public required string Email { get; set; }
}