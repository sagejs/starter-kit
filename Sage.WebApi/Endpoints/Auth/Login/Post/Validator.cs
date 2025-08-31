using FastEndpoints;
using FluentValidation;

namespace Sage.WebApi.Endpoints.Auth.Login.Post;

sealed class Validator : Validator<Request>
{
    public Validator()
    {
        RuleFor(e => e.Email)
            .NotEmpty()
            .EmailAddress();
    }
}