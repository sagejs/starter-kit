using System;
using Sage.WebApi.Endpoints.Auth.Login;

namespace Sage.WebApi.Endpoints.Auth;

public static class AuthEndpoints
{
  public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
  {
    var auth = app.MapGroup("/Auth");
    auth.MapLoginEndpoint();
    return auth;
  }
}
