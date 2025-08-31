using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var db = builder.AddPostgres("db")
    .WithPgWeb(o => o.WithHostPort(8080))
    .WithDataVolume("sage-starter-kit")
    .AddDatabase("starter-kit");

var api = builder.AddProject<Sage_WebApi>("api")
    .WithReference(db)
    .WaitFor(db);

var app = builder.AddNpmApp("app", "../Sage.WebApp", "dev")
    .WithReference(api);

builder.Build().Run();