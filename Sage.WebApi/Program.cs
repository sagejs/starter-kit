using FastEndpoints;
using FastEndpoints.Security;
using FastEndpoints.Swagger;
using Microsoft.EntityFrameworkCore;
using Resend;
using Sage.WebApi.Context;
using Sage.WebApi.Options;
using Sage.WebApi.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.AddNpgsqlDbContext<AppDbContext>("starter-kit");

builder.Services.AddOptions<ResendOptions>()
    .Bind(builder.Configuration.GetSection("Resend"));

builder.Services.AddRazorPages();

builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>(builder.Configuration.GetSection("Resend"));

builder.Services.AddTransient<IResend, ResendClient>();
builder.Services.AddTransient<EmailService>();

builder.Services.AddAuthenticationCookie(validFor: TimeSpan.FromDays(14));
builder.Services.AddAuthorization();

builder.Services.AddFastEndpoints();
builder.Services.SwaggerDocument(options =>
{
    options.DocumentSettings = settings =>
    {
        settings.Title = "Starter Kit API";
        settings.Version = "v1";
    };
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.WithOrigins("http://localhost:3000");
        }

        policy.WithOrigins("https://start.qinguan.me");

        policy.AllowCredentials();
        policy.AllowAnyMethod();
        policy.AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.UseFastEndpoints();
app.UseOpenApi(config => { config.Path = "/openapi/{documentName}.json"; });

app.MapDefaultEndpoints();
app.MapScalarApiReference();

app.MapRazorPages();

if (app.Environment.IsDevelopment())
{
    await using var scope = app.Services.CreateAsyncScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

app.Run();