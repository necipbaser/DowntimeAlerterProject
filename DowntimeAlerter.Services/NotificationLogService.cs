using System.Collections.Generic;
using System.Threading.Tasks;
using DowntimeAlerter.Core;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Services;

namespace DowntimeAlerter.Services
{
    public class NotificationLogService : INotificationLogService
    {
        private readonly IUnitOfWork _unitOfWork;

        public NotificationLogService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<NotificationLog>> GetLogs()
        {
            return await _unitOfWork.NotificationLogs.GetLogsAsync();
        }

        public async Task<NotificationLog> CreateNotificationLog(NotificationLog notificationLog)
        {
            await _unitOfWork.NotificationLogs.AddAsync(notificationLog);
            await _unitOfWork.CommitAsync();
            return notificationLog;
        }
    }
}