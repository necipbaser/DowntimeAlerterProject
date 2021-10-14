using Microsoft.EntityFrameworkCore;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DowntimeAlerter.Data.Repositories
{
    class NotificationLogRepository : Repository<NotificationLog>, INotificationLogRepository
    {
        public NotificationLogRepository(DowntimeAlerterDbContext context)
     : base(context)
        { }
        public async Task<IEnumerable<NotificationLog>> GetLogsAsync()
        {
            return await DowntimeAlerterDbContext.NotificationLogs.ToListAsync();
        }

        private DowntimeAlerterDbContext DowntimeAlerterDbContext
        {
            get { return Context as DowntimeAlerterDbContext; }
        }
    }
}
