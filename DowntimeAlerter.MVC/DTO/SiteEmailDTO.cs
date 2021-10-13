using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DowntimeAlerter.MVC.DTO
{
    public class SiteEmailDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public int SiteId { get; set; }
        //public SiteDTO Site { get; set; }
    }
}
