using System.Threading.Tasks;
using DowntimeAlerter.Core.Models;

namespace DowntimeAlerter.Core.Services
{
    public interface IUserService
    {
        Task<User> GetUserAsync(User user);
    }
}