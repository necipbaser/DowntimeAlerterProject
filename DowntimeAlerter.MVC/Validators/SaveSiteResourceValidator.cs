using DowntimeAlerter.MVC.DTO;
using FluentValidation;

namespace DowntimeAlerter.MVC.Validators
{
    public class SaveSiteResourceValidator : AbstractValidator<SiteDTO>
    {
        public SaveSiteResourceValidator()
        {
            RuleFor(a => a.Name)
                .NotEmpty()
                .MaximumLength(50);
        }
    }
}