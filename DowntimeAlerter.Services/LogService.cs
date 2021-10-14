using DowntimeAlerter.Core;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Services;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace DowntimeAlerter.Services
{
    public class LogService : ILogService
    {
        private readonly IUnitOfWork _unitOfWork;
        public LogService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Log> GetLog(int id)
        {
            return await _unitOfWork.Logs.GetLog(id);
        }

        public async Task<IEnumerable<Log>> GetLogs()
        {
            return await _unitOfWork.Logs.GetLogsAsync();
        }
    }
}
