using FastEndpoints;
using FastEndpoints.Security;
using Microsoft.EntityFrameworkCore;
using Sage.WebApi.Context;

namespace Sage.WebApi.Endpoints.Auth.WhoAmI.Get;

sealed class Endpoint(
    ILogger<Endpoint> logger,
    AppDbContext dbContext
) : EndpointWithoutRequest<Response>
{
    public override void Configure()
    {
        Get("/Auth/WhoAmI");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var userId = Guid.Parse(User.ClaimValue("UserId") ?? throw new Exception("Missing UserId claim"));
        var user = await dbContext.Users.SingleOrDefaultAsync(u => u.Id == userId, cancellationToken: ct);
        if (user is null)
        {
            logger.LogError("User {UserId} is authenticated but does not exist", userId);
            await SendUnauthorizedAsync(ct);
            return;
        }

        await SendOkAsync(new Response
        {
            Id = userId,
            Name = user.Name,
            Image = user.Image,
            Email = user.Email,
        }, ct);
    }
}