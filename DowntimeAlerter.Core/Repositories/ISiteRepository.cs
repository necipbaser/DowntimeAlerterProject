using DowntimeAlerter.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DowntimeAlerter.Core.Repositories
{
    public interface ISiteRepository : IRepository<Site>
    {
        Task<IEnumerable<Site>> GetAllWithSiteEmailsAsync();
        Task<Site> GetWithSiteEmailsByIdAsync(int id);
    }
}
