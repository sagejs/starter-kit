using System;
using System.Data.Common;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using Resend;
using Sage.WebApi.Entities;
using Sage.WebApi.Services;
using Sage.WebApi.Views.Emails;

namespace Sage.WebApi.Endpoints.Auth.Login;

public class LoginRequest {
  public string Email {get;set;}
}

public class LoginValidator : AbstractValidator<LoginRequest>
{
  public LoginValidator()
  {
    RuleFor(e => e.Email)
      .EmailAddress();
  }
}

public static class LoginEndpoint
{
  public static IEndpointRouteBuilder MapLoginEndpoint(this IEndpointRouteBuilder app)
  {
    app.MapPost("/Login", Login);

    return app;
  }

  public static async Task<IResult> Login(
    [AsParameters] RequestServices services,
    [FromBody] LoginRequest req,
    CancellationToken ct
  )
  {
    var validator = new LoginValidator();
    var res = await validator.ValidateAsync(req);

    if (!res.IsValid)
    {
      return TypedResults.ValidationProblem(res.ToDictionary());
    }

    var expires = DateTime.UtcNow.AddMinutes(15);
    var token = RandomNumberGenerator.GetString("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 6);
    var prefix = RandomNumberGenerator.GetString("ABCDEFGHJKLMNPQRSTUVWXYZ", 3);
    var hashedToken = SCryptGenerate(Encoding.Default.GetBytes(token), Encoding.Default.GetBytes(req.Email));


    var item = await services.AppDbContext.VerificationTokens.SingleOrDefaultAsync(t => t.Id == req.Email, cancellationToken: ct);
    if (item is null)
    {
      item = new VerificationToken
      {
        Id = req.Email,
        Token = hashedToken,
        Expires = expires
      };

      await services.AppDbContext.VerificationTokens.AddAsync(item, ct);
    }

    item.Token = hashedToken;
    item.Expires = expires;

    await services.AppDbContext.SaveChangesAsync(ct);

    await services.EmailService.SendEmailAsync(
      req.Email,
      "Your verification code",
      "Login",
      new LoginModel
      {
        Code = token
      }
    );

    return TypedResults.Text(JsonSerializer.Serialize(new
    {
      token,
      prefix
    }));
  }

  private static byte[] SCryptGenerate(byte[] password, byte[] salt)
  {
    // Reference : https://nodejs.org/api/crypto.html#cryptoscryptsyncpassword-salt-keylen-options
    return SCrypt.Generate(password, salt, 16384, 8, 1, 64);
  }

  private static bool TimingSafeEquals(byte[] left, byte[] right)
  {
    return CryptographicOperations.FixedTimeEquals(left, right);
  }
}
