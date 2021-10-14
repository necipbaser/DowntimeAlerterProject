using AutoMapper;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Services;
using DowntimeAlerter.MVC.ActionFilters;
using DowntimeAlerter.MVC.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DowntimeAlerter.MVC.Controllers
{
    [ServiceFilter(typeof(LoginFilterAttribute))]
    public class NotificationLogController : Controller
    {
        private readonly ILogger<NotificationLogController> _logger;
        private readonly INotificationLogService _notificaitonLogService;
        private readonly IMapper _mapper;


        public NotificationLogController(ILogger<NotificationLogController> logger, INotificationLogService notificaitionLogService, IMapper mapper)
        {
            _notificaitonLogService = notificaitionLogService;
            _logger = logger;
            _mapper = mapper;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<LogDTO>>> GetAllLogs()
        {
            var logs = await _notificaitonLogService.GetLogs();
            var logsDto = _mapper.Map<IEnumerable<NotificationLog>, IEnumerable<NotificationLogDTO>>(logs);
            return Json(new { data = logsDto });
        }
    }
}
