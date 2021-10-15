using System.Collections.Generic;
using System.Threading.Tasks;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DowntimeAlerter.Data.Repositories
{
    internal class NotificationLogRepository : Repository<NotificationLog>, INotificationLogRepository
    {
        public NotificationLogRepository(DowntimeAlerterDbContext context)
            : base(context)
        {
        }

        private DowntimeAlerterDbContext DowntimeAlerterDbContext => Context as DowntimeAlerterDbContext;

        public async Task<IEnumerable<NotificationLog>> GetLogsAsync()
        {
            return await DowntimeAlerterDbContext.NotificationLogs.ToListAsync();
        }
    }
}