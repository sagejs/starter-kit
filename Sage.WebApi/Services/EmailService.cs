using System;
using System.Diagnostics;
using System.Security.Principal;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.ViewFeatures.Infrastructure;
using Microsoft.Extensions.Options;
using Resend;
using Sage.WebApi.Options;

namespace Sage.WebApi.Services;

public class EmailService(
  ILogger<EmailService> logger,
  IOptions<ResendOptions> options,
  IResend resend,
  IRazorViewEngine razor,
  IServiceProvider serviceProvider,
  TempDataSerializer tempDataSerializer
)
{
  private static readonly ActivitySource source = new("Sage.WebApi.Services.EmailService", "0.1.0");

  public async Task SendEmailAsync<T>(string to, string subject, string view, T model)
  {
    logger.LogInformation("Sending email to '{To}' with subject '{Subject}'", to, subject);
    using var activity = source.StartActivity(nameof(SendEmailAsync));
    activity?.SetTag("To", to);
    activity?.SetTag("Subject", subject);
    activity?.SetTag("View", view);

    var res = await resend.EmailSendAsync(new EmailMessage
    {
      From = options.Value.From ?? "hello@start.qinguan.me",
      To = to,
      Subject = subject,
      HtmlBody = await RenderEmail(view, model)
    });

    activity?.SetTag("Result.Content", res.Content);
    activity?.SetTag("Result.Success", res.Success);
  }

  public async Task<string> RenderEmail<T>(string view, T model)
  {
    var viewEngineResult = razor.GetView("~/Views/Emails/", $"{view}.cshtml", false);

    if (viewEngineResult == null)
      throw new ApplicationException("View not found");

    if (viewEngineResult.Success == false)
      throw new ApplicationException("View failed");

    var actionContext = new ActionContext(
      new DefaultHttpContext { RequestServices = serviceProvider },
      new RouteData(),
      new ActionDescriptor()
    );

    var sb = new StringBuilder();

    using (var sw = new StringWriter(sb))
    {
      var tempDataProvider = new SessionStateTempDataProvider(tempDataSerializer);

      var viewContext = new ViewContext(
          actionContext,
          viewEngineResult.View,
          new ViewDataDictionary<T>(
              metadataProvider: new EmptyModelMetadataProvider(),
              modelState: new ModelStateDictionary()
          )
          {
            Model = model
          },
          new TempDataDictionary(actionContext.HttpContext, tempDataProvider),
          sw,
          new HtmlHelperOptions()
      );

      await viewEngineResult.View.RenderAsync(viewContext);
    }

    return sb.ToString();
  }
}
