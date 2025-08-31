using System.Security.Cryptography;
using System.Text;
using FastEndpoints;
using FastEndpoints.Security;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using Sage.WebApi.Constants;
using Sage.WebApi.Context;
using Sage.WebApi.Entities;

namespace Sage.WebApi.Endpoints.Auth.Verify.Post;

sealed class Endpoint(
    ILogger<Endpoint> logger,
    AppDbContext dbContext
) : Endpoint<Request, Response>
{
    public override void Configure()
    {
        Post("/Auth/Verify");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        logger.LogInformation("OTP verification request");

        var item = await dbContext.VerificationTokens
            .SingleOrDefaultAsync(t => t.Id == req.Email, cancellationToken: ct);

        if (item is null)
        {
            logger.LogInformation("User {Email} tried to login without requesting OTP", req.Email);
            await SendUnauthorizedAsync(ct);
            return;
        }

        if (DateTime.UtcNow > item.Expires)
        {
            logger.LogInformation("User {Email} tried to login after OTP expired", req.Email);
            await SendUnauthorizedAsync(ct);
            return;
        }

        if (item.Attempts > 5)
        {
            logger.LogInformation("User {Email} tried to login after {Attempts} attempts", req.Email, item.Attempts);
            await SendUnauthorizedAsync(ct);
            return;
        }

        var hashedToken = SCryptGenerate(Encoding.Default.GetBytes(req.Token), Encoding.Default.GetBytes(item.Id));

        if (!CryptographicOperations.FixedTimeEquals(hashedToken, item.Token))
        {
            AddError(r => r.Token, "Invalid token");
            ThrowIfAnyErrors();
        }

        var emailName = req.Email.Split("@").FirstOrDefault() ?? "Unknown";

        var user = await dbContext.Users.SingleOrDefaultAsync(u => u.Email == req.Email, ct) ??
                   (await dbContext.Users.AddAsync(new User
                   {
                       Email = req.Email,
                       Name = emailName
                   }, ct)).Entity;

        var sanitizedEmail = req.Email.Trim().ToLowerInvariant();
        var account = await dbContext.Accounts.SingleOrDefaultAsync(
            a => a.Provider == AccountProviders.Email && a.ProviderAccountId == sanitizedEmail,
            cancellationToken: ct
        );

        if (account is null)
        {
            await dbContext.Accounts.AddAsync(new Account
            {
                Provider = AccountProviders.Email,
                ProviderAccountId = sanitizedEmail,
                UserId = user.Id
            }, ct);
        }

        dbContext.Remove(item);

        await dbContext.SaveChangesAsync(ct);
        await CookieAuth.SignInAsync(u => { u["UserId"] = user.Id.ToString(); });

        await SendOkAsync(new Response
        {
            Id = user.Id,
            Name = user.Name,
            Image = user.Image,
            Email = user.Email
        }, ct);
    }

    private static byte[] SCryptGenerate(byte[] password, byte[] salt)
    {
        // Reference : https://nodejs.org/api/crypto.html#cryptoscryptsyncpassword-salt-keylen-options
        return SCrypt.Generate(password, salt, 16384, 8, 1, 64);
    }
}