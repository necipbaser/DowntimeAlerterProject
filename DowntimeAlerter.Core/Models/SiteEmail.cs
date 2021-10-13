
namespace DowntimeAlerter.Core.Models
{
    public class SiteEmail
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public int SiteId { get; set; }
        public Site Site { get; set; }
    }
}
