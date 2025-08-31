namespace Sage.WebApi.Endpoints.Auth.WhoAmI.Get;

sealed class Response
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Image { get; set; }
    public string Email { get; set; }
}