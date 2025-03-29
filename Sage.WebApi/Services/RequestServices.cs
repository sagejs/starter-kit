using System;
using SSTAlumniAssociation.Core.Context;

namespace Sage.WebApi.Services;

public class RequestServices(
  AppDbContext appDbContext,
  EmailService emailService
)
{
  public AppDbContext AppDbContext { get; } = appDbContext;
  public EmailService EmailService { get; } = emailService;
}
