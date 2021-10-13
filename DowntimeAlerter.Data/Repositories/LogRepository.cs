using Microsoft.EntityFrameworkCore;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;


namespace DowntimeAlerter.Data.Repositories
{
    public class LogRepository : Repository<Log>, ILogRepository
    {
        public LogRepository(DowntimeAlerterDbContext context)
           : base(context)
        { }

        public async Task<IEnumerable<Log>> GetLogsAsync()
        {
            return await DowntimeAlerterDbContext.Logs.ToListAsync();
        }

        private DowntimeAlerterDbContext DowntimeAlerterDbContext
        {
            get { return Context as DowntimeAlerterDbContext; }
        }
    }
}
