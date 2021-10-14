using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DowntimeAlerter.MVC.Models;
using DowntimeAlerter.MVC.ActionFilters;
using DowntimeAlerter.Core.Services;
using AutoMapper;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.MVC.DTO;

namespace DowntimeAlerter.MVC.Controllers
{
    [ServiceFilter(typeof(LoginFilterAttribute))]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ISiteService _siteService;
        private readonly ISiteEmailService _siteEmailService;
        private readonly INotificationLogService _notificationLogService;
        private readonly IMapper _mapper;
        public HomeController(ILogger<HomeController> logger,
            ISiteService siteService,
            ISiteEmailService siteEmailService,
            INotificationLogService notificationService,
            IMapper mapper)
        {
            _logger = logger;
            _siteEmailService = siteEmailService;
            _siteService = siteService;
            _mapper = mapper;
            _notificationLogService = notificationService;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var sites = await _siteService.GetAllSites();
                var siteResources = _mapper.Map<IEnumerable<Site>, IEnumerable<SiteDTO>>(sites);
                var siteEmails = await _siteEmailService.GetAllWithSite();
                var siteEmailResources = _mapper.Map<IEnumerable<SiteEmail>, IEnumerable<SiteEmailDTO>>(siteEmails);
                var notificationLogs = await _notificationLogService.GetLogs();
                var notificationLogsResource = _mapper.Map<IEnumerable<NotificationLog>, IEnumerable<NotificationLogDTO>>(notificationLogs);

                ViewBag.SiteCount = siteResources.Count();
                ViewBag.SiteEmailCount = siteEmailResources.Count();
                ViewBag.NotificationLogsCount = notificationLogsResource.Count();
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex.Message);
            }

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

    }
}
