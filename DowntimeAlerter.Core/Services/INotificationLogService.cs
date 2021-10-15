using System.Collections.Generic;
using System.Threading.Tasks;
using DowntimeAlerter.Core.Models;

namespace DowntimeAlerter.Core.Services
{
    public interface INotificationLogService
    {
        Task<IEnumerable<NotificationLog>> GetLogs();
        Task<NotificationLog> CreateNotificationLog(NotificationLog newNotificationLog);
    }
}