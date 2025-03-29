using Microsoft.EntityFrameworkCore;
using Resend;
using Sage.WebApi.Endpoints.Auth;
using Sage.WebApi.Options;
using Sage.WebApi.Services;
using Scalar.AspNetCore;
using SSTAlumniAssociation.Core.Context;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<AppDbContext>("starter-kit");

builder.Services.AddOptions<ResendOptions>()
    .Bind(builder.Configuration.GetSection("Resend"));

builder.Services.AddRazorPages();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>(builder.Configuration.GetSection("Resend"));

builder.Services.AddTransient<IResend, ResendClient>();
builder.Services.AddTransient<EmailService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    
    await using var scope = app.Services.CreateAsyncScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

app.UseHttpsRedirection();

app.MapDefaultEndpoints();
app.MapRazorPages();

app.MapScalarApiReference(options =>
{
    // Pending bugfix release: https://github.com/dotnet/aspnetcore/pull/60673
    options.Servers = [];
});

app.MapAuthEndpoints();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
