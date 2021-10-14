using DowntimeAlerter.Core;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DowntimeAlerter.Services
{
    public class NotificationLogService: INotificationLogService
    {
        private readonly IUnitOfWork _unitOfWork;
        public NotificationLogService(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
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
