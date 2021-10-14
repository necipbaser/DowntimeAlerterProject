using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.Extensions.Logging;
using DowntimeAlerter.Core.Services;
using AutoMapper;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.MVC.DTO;
using System.Net.Http;
using System.Net;
using MimeKit;
using DowntimeAlerter.MVC.Notification.Settings;
using Microsoft.Extensions.Options;
using MailKit.Security;
using MailKit.Net.Smtp;
using Hangfire.Storage;

namespace DowntimeAlerter.MVC.Controllers
{
    public class TaskController : Controller
    {
        private readonly ILogger<TaskController> _logger;
        private readonly ISiteService _siteService;
        private readonly ISiteEmailService _siteEmailService;
        private readonly INotificationLogService _notificaitionLogService;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;
        private readonly MailSettings _mailSettings;

        public TaskController(ILogger<TaskController> logger, ISiteService siteService, IMapper mapper, IOptions<MailSettings> mailSettings, ISiteEmailService siteEmailService,INotificationLogService notificaitionLogService)
        {
            _siteService = siteService;
            _siteEmailService = siteEmailService;
            _notificaitionLogService = notificaitionLogService;
            _logger = logger;
            _mapper = mapper;
            _httpClient = new HttpClient();
            _mailSettings = mailSettings.Value;
        }

        public void StartRecurringNotificationJob()
        {
            RemoveJob();
            var sites = _siteService.GetAllSites();
            var siteResources = _mapper.Map<IEnumerable<Site>, IEnumerable<SiteDTO>>(sites.Result);
            foreach (var item in siteResources)
            {
                var siteEmails = _siteEmailService.GetSiteEmailsBySiteId(item.Id).Result;
                var siteEmailDTO = _mapper.Map<IEnumerable<SiteEmail>, IEnumerable<SiteEmailDTO>>(siteEmails);
                item.SiteEmails = siteEmailDTO;
                item.CheckedDate = DateTime.Now;
            }
            RecurringJob.AddOrUpdate(() => SendMail(siteResources), Cron.Minutely);
        }

        public void SendMail(IEnumerable<SiteDTO> siteResources)
        {
            //get all sites
            try
            {
                foreach (var item in siteResources)
                {
                    var timeDifference = (DateTime.Now - item.CheckedDate).TotalSeconds;
                    if (!(timeDifference >= item.IntervalTime))
                        continue;
                    else
                    {
                        try
                        {
                            var userEmails = item.SiteEmails.Select(s => s.Email).ToList();
                            SendEmailToSiteUsers(userEmails,item);
                        }
                        catch (Exception ex)
                        {
                            var notificaitionLog = new NotificationLog();
                            string message = item.Url + " Name Not Resolved.";
                            notificaitionLog.Message = message;
                            notificaitionLog.SiteName = item.Name;
                            notificaitionLog.State = "Name Not Resolved";
                            SaveNotificatonLog(notificaitionLog);
                            _logger.LogError("An error occured for " + item.Name + " while checking health of it. System Message:" +
                                ex.Message);
                        }
                        item.CheckedDate = DateTime.Now;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }

        public void SendEmailToSiteUsers(List<string> userEmails, SiteDTO site)
        {
            foreach (var userEmail in userEmails)
            {
                var responseMsg = _httpClient.GetAsync(site.Url).GetAwaiter().GetResult();
                MailRequest request = new MailRequest();
                request.ToEmail = userEmail;
                request.Subject = "Downtime Alerter";
                var notificaitionLog = new NotificationLog();
                if ((int)responseMsg.StatusCode >= 200 && (int)responseMsg.StatusCode <= 299)
                {
                    string message = site.Url + " is UP.";
                    notificaitionLog.Message = message;
                    notificaitionLog.SiteName = site.Name;
                    notificaitionLog.State = "Up";
                    SaveNotificatonLog(notificaitionLog);
                    request.Body = message;
                }
                else
                {
                    string message = site.Url + " is DOWN.";
                    notificaitionLog.Message = message;
                    notificaitionLog.SiteName = site.Name;
                    notificaitionLog.State = "Down";
                    SaveNotificatonLog(notificaitionLog);
                    request.Body = message;
                }
                SendEmail(request);
            }
        }

        public void SendEmail(MailRequest mailRequest)
        {
            try
            {
                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
                email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));
                email.Subject = mailRequest.Subject;
                var builder = new BodyBuilder();

                builder.HtmlBody = mailRequest.Body;
                email.Body = builder.ToMessageBody();
                using var smtp = new SmtpClient();
                smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                smtp.Send(email);
                smtp.Disconnect(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }

        public void RemoveJob()
        {
            using (var connection = JobStorage.Current.GetConnection())
            {
                foreach (var recurringJob in connection.GetRecurringJobs())
                {
                    RecurringJob.RemoveIfExists(recurringJob.Id);
                }
            }
        }

        public void SaveNotificatonLog(NotificationLog notificationLog)
        {
            try
            {
                notificationLog.CheckedDate = DateTime.Now;
                _notificaitionLogService.CreateNotificationLog(notificationLog);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }
    }
}
