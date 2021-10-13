using Microsoft.EntityFrameworkCore;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DowntimeAlerter.Data.Repositories
{
    public class SiteEmailRepository : Repository<SiteEmail>, ISiteEmailRepository
    {
        public SiteEmailRepository(DowntimeAlerterDbContext context)
           : base(context)
        { }

        public async Task<IEnumerable<SiteEmail>> GetAllWithSiteAsync()
        {
            return await DowntimeAlerterDbContext.SiteEmails
                 .Include(m => m.Site)
                 .ToListAsync();
        }

        public async Task<IEnumerable<SiteEmail>> GetAllWithSiteBySiteIdAsync(int siteId)
        {
            return await DowntimeAlerterDbContext.SiteEmails
               .Include(m => m.Site)
               .Where(m => m.SiteId == siteId)
               .ToListAsync();
        }

        public async Task<SiteEmail> GetWithSiteByIdAsync(int id)
        {
            return await DowntimeAlerterDbContext.SiteEmails
                .Include(m => m.Site)
                .SingleOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<SiteEmail>> GetAllSiteEmailByEmail(SiteEmail siteEmail)
        {
            return await DowntimeAlerterDbContext.SiteEmails
              .Where(w=>w.Email==siteEmail.Email && w.SiteId==siteEmail.SiteId).ToListAsync();
        }

        private DowntimeAlerterDbContext DowntimeAlerterDbContext
        {
            get { return Context as DowntimeAlerterDbContext; }
        }
    }
}
