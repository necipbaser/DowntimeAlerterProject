using DowntimeAlerter.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DowntimeAlerter.Core.Services
{
    public interface IUserService
    {
        Task<User> GetUserAsync(User user);
    }
}
