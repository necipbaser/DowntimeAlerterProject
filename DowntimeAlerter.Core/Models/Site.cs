using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace DowntimeAlerter.Core.Models
{
    public class Site
    {
        public Site()
        {
            SiteEmails = new Collection<SiteEmail>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public long IntervalTime { get; set; }
        public ICollection<SiteEmail> SiteEmails { get; set; }
    }
}
