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
    public class LogController : Controller
    {
        private readonly ILogger<LogController> _logger;
        private readonly ILogService _logService;
        private readonly IMapper _mapper;

        public LogController(ILogger<LogController> logger, ILogService logService,IMapper mapper)
        {
            _logService = logService;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<LogDTO>>> GetAllLogs()
        {
            try
            {
                var logs = await _logService.GetLogs();
                var logsDto = _mapper.Map<IEnumerable<Log>, IEnumerable<LogDTO>>(logs).OrderByDescending(o => o.TimeStamp);
                return Json(new { data = logsDto });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Json(new { data = false });
            }
        }

        [HttpGet]
        public async Task<IActionResult> LogDetails(int id)
        {
            try
            {
                var log = await _logService.GetLog(id);
                var logDTO = _mapper.Map<Log, LogDTO>(log);
                return View(logDTO);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return null;
            }
        }
    }
}
