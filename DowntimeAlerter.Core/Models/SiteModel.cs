using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DowntimeAlerter.Core.Models
{
    public class SiteModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public long IntervalTime { get; set; }
        public DateTime CheckedDate { get; set; }
        public ICollection<SiteEmail> SiteEmails { get; set; }
    }
}
