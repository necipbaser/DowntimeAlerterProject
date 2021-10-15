using System.Threading.Tasks;
using DowntimeAlerter.Core.Repositories;

namespace DowntimeAlerter.Core
{
    public interface IUnitOfWork
    {
        ISiteEmailRepository SiteEmails { get; }
        ISiteRepository Sites { get; }
        IUserRepository Users { get; }
        ILogRepository Logs { get; }
        INotificationLogRepository NotificationLogs { get; }
        Task<int> CommitAsync();
    }
}