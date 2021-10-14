using DowntimeAlerter.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DowntimeAlerter.Core.Services
{
    public interface INotificationLogService
    {
        Task<IEnumerable<NotificationLog>> GetLogs();
        Task<NotificationLog> CreateNotificationLog(NotificationLog newNotificationLog);

    }
}
