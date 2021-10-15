using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Services;
using DowntimeAlerter.MVC.ActionFilters;
using DowntimeAlerter.MVC.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DowntimeAlerter.MVC.Controllers
{
    [ServiceFilter(typeof(LoginFilterAttribute))]
    public class NotificationLogController : Controller
    {
        private readonly ILogger<NotificationLogController> _logger;
        private readonly IMapper _mapper;
        private readonly INotificationLogService _notificaitonLogService;


        public NotificationLogController(ILogger<NotificationLogController> logger,
            INotificationLogService notificaitionLogService, IMapper mapper)
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
            try
            {
                var logs = await _notificaitonLogService.GetLogs();
                var logsDto = _mapper.Map<IEnumerable<NotificationLog>, IEnumerable<NotificationLogDTO>>(logs)
                    .OrderByDescending(o => o.CheckedDate);
                return Json(new {data = logsDto});
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Json(new {data = false});
            }
        }
    }
}