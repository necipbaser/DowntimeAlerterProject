﻿using DowntimeAlerter.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DowntimeAlerter.Core.Repositories
{
    public interface ISiteEmailRepository : IRepository<SiteEmail>
    {
        Task<IEnumerable<SiteEmail>> GetAllWithSiteAsync();
        Task<SiteEmail> GetWithSiteByIdAsync(int id);
        Task<IEnumerable<SiteEmail>> GetAllWithSiteBySiteIdAsync(int siteId);
        Task<IEnumerable<SiteEmail>> GetAllSiteEmailByEmail(SiteEmail siteEmail);

    }
}
