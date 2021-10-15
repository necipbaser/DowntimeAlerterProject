using System.Collections.Generic;
using System.Threading.Tasks;
using DowntimeAlerter.Core.Models;

namespace DowntimeAlerter.Core.Repositories
{
    public interface ISiteRepository : IRepository<Site>
    {
        Task<IEnumerable<Site>> GetAllWithSiteEmailsAsync();
        Task<Site> GetWithSiteEmailsByIdAsync(int id);
        Task<Site> GetSiteByUrl(Site user);

    }
}