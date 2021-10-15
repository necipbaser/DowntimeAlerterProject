using System.Collections.Generic;
using System.Threading.Tasks;
using DowntimeAlerter.Core.Models;

namespace DowntimeAlerter.Core.Repositories
{
    public interface INotificationLogRepository : IRepository<NotificationLog>
    {
        Task<IEnumerable<NotificationLog>> GetLogsAsync();
    }
}