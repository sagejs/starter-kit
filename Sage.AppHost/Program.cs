using Projects;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Sage_WebApi>("api");
builder.AddNpmApp("app", "../Sage.WebApp", "dev");

builder.Build().Run();