using Microsoft.EntityFrameworkCore;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DowntimeAlerter.Data.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(DowntimeAlerterDbContext context)
           : base(context)
        { }

        public async Task<User> GetUserAsync(User user)
        {
            return await DowntimeAlerterDbContext.Users
                .Where(w => w.UserName == user.UserName && w.Password == user.Password).FirstOrDefaultAsync();
        }

        private DowntimeAlerterDbContext DowntimeAlerterDbContext
        {
            get { return Context as DowntimeAlerterDbContext; }
        }
    }
}
