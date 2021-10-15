using System.Collections.Generic;
using System.Threading.Tasks;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DowntimeAlerter.Data.Repositories
{
    public class SiteRepository : Repository<Site>, ISiteRepository
    {
        public SiteRepository(DowntimeAlerterDbContext context)
            : base(context)
        {
        }

        private DowntimeAlerterDbContext DowntimeAlerterDbContext => Context as DowntimeAlerterDbContext;

        public async Task<IEnumerable<Site>> GetAllWithSiteEmailsAsync()
        {
            return await DowntimeAlerterDbContext.Sites
                .Include(a => a.SiteEmails)
                .ToListAsync();
        }

        public async Task<Site> GetWithSiteEmailsByIdAsync(int id)
        {
            return await DowntimeAlerterDbContext.Sites
                .Include(a => a.SiteEmails)
                .SingleOrDefaultAsync(a => a.Id == id);
        }
    }
}