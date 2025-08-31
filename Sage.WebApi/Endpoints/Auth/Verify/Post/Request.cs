namespace Sage.WebApi.Endpoints.Auth.Verify.Post;

sealed class Request
{
    public string Email { get; set; }
    public string Token { get; set; }
}