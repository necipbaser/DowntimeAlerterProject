using DowntimeAlerter.Core;
using DowntimeAlerter.Core.Repositories;
using DowntimeAlerter.Data.Repositories;
using System.Threading.Tasks;

namespace DowntimeAlerter.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DowntimeAlerterDbContext _context;
        private SiteEmailRepository _siteEmailRepository;
        private SiteRepository _siteRepository;
        private UserRepository _userRepository;
        private LogRepository _logRepository;

        public UnitOfWork(DowntimeAlerterDbContext context)
        {
            this._context = context;
        }

        public ISiteEmailRepository SiteEmails => _siteEmailRepository = _siteEmailRepository ?? new SiteEmailRepository(_context);

        public ISiteRepository Sites => _siteRepository = _siteRepository ?? new SiteRepository(_context);

        public IUserRepository Users => _userRepository = _userRepository ?? new UserRepository(_context);

        public ILogRepository Logs => _logRepository = _logRepository ?? new LogRepository(_context);


        public async Task<int> CommitAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
