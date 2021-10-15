﻿using System.Collections.Generic;
using System.Threading.Tasks;
using DowntimeAlerter.Core.Models;

namespace DowntimeAlerter.Core.Services
{
    public interface ISiteService
    {
        Task<IEnumerable<Site>> GetAllSites();
        Task<Site> GetSiteById(int id);
        Task<Site> CreateSite(Site newSite);
        Task UpdateSite(Site siteToBeUpdated, Site site);
        Task DeleteSite(Site site);
        Task<Site> GetSiteByUrl(Site user);

    }
}