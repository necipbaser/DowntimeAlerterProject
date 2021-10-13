using DowntimeAlerter.Core.Repositories;
using System.Threading.Tasks;

namespace DowntimeAlerter.Core
{
    public interface IUnitOfWork
    {
        ISiteEmailRepository SiteEmails { get; }
        ISiteRepository Sites { get; }
        IUserRepository Users { get; }
        ILogRepository Logs { get; }
        Task<int> CommitAsync();
    }
}
