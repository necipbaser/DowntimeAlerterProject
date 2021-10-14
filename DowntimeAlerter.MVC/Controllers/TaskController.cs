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
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;
        private readonly MailSettings _mailSettings;

        public TaskController(ILogger<TaskController> logger, ISiteService siteService, IMapper mapper, IOptions<MailSettings> mailSettings, ISiteEmailService siteEmailService)
        {
            _siteService = siteService;
            _siteEmailService = siteEmailService;
            _logger = logger;
            _mapper = mapper;
            _httpClient = new HttpClient();
            _mailSettings = mailSettings.Value;
        }

        public void StartNotificationJob()
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
            _logger.LogError("before");
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
                            foreach (var userEmail in userEmails)
                            {
                                var responseMsg = _httpClient.GetAsync(item.Url).GetAwaiter().GetResult();
                                MailRequest request = new MailRequest();
                                request.ToEmail = userEmail;
                                request.Subject = "Downtime Alerter";
                                if (responseMsg.StatusCode != HttpStatusCode.OK)
                                {
                                    request.Body = item.Url + " is down.";
                                }
                                else
                                {
                                    request.Body = item.Url + " is up.";
                                }
                                SendEmail(request);
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError("An error occured for " + item.Name + " while checking health of it.");
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

        public void SendEmail(MailRequest mailRequest)
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
    }
}
