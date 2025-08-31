using FastEndpoints;
using FluentValidation;

namespace Sage.WebApi.Endpoints.Auth.Verify.Post;

sealed class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(e => e.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(e => e.Token)
            .NotEmpty()
            .Length(6);
    }
}