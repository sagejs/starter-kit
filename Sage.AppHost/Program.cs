using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var db = builder.AddPostgres("db")
  .WithPgWeb()
  .AddDatabase("starter-kit");

builder.AddProject<Sage_WebApi>("api")
  .WithReference(db);

builder.AddNpmApp("app", "../Sage.WebApp", "dev");

builder.Build().Run();
