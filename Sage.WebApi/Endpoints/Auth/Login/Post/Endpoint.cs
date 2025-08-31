using System.Security.Cryptography;
using System.Text;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using Sage.WebApi.Context;
using Sage.WebApi.Entities;
using Sage.WebApi.Services;
using Sage.WebApi.Views.Emails;

namespace Sage.WebApi.Endpoints.Auth.Login.Post;

sealed class Endpoint(
    ILogger<Endpoint> logger,
    AppDbContext dbContext,
    EmailService emailService
) : Endpoint<Request, Response>
{
    public override void Configure()
    {
        Post("/Auth/Login");
        AllowAnonymous();
    }

    public override async Task HandleAsync(Request req, CancellationToken ct)
    {
        logger.LogInformation("Login request");

        var expires = DateTime.UtcNow.AddMinutes(15);
        var token = RandomNumberGenerator.GetString("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 6);
        var prefix = RandomNumberGenerator.GetString("ABCDEFGHJKLMNPQRSTUVWXYZ", 3);
        var hashedToken = SCryptGenerate(Encoding.Default.GetBytes(token), Encoding.Default.GetBytes(req.Email));

        var item = await dbContext.VerificationTokens
            .SingleOrDefaultAsync(t => t.Id == req.Email, cancellationToken: ct);

        if (item is null)
        {
            item = new VerificationToken
            {
                Id = req.Email,
                Token = hashedToken,
                Expires = expires
            };

            await dbContext.VerificationTokens.AddAsync(item, ct);
        }
        else
        {
            item.Token = hashedToken;
            item.Expires = expires;
        }

        await dbContext.SaveChangesAsync(ct);

        await emailService.SendEmailAsync(
            req.Email,
            "Your verification code",
            "Login",
            new LoginModel
            {
                Code = token
            },
            ct
        );

        await SendOkAsync(new Response
        {
            Email = item.Id,
            Prefix = prefix
        }, ct);
    }

    private static byte[] SCryptGenerate(byte[] password, byte[] salt)
    {
        // Reference : https://nodejs.org/api/crypto.html#cryptoscryptsyncpassword-salt-keylen-options
        return SCrypt.Generate(password, salt, 16384, 8, 1, 64);
    }
}