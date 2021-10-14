using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DowntimeAlerter.MVC.Notification
{
    public interface IMailService
    {
        Task SendEmailAsync(MailRequest mailRequest);
    }
}
