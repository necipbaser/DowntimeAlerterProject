using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DowntimeAlerter.MVC.DTO
{
    public class NotificationLogDTO
    {
        public int Id { get; set; }
        public string State { get; set; }
        public string SiteName { get; set; }
        public string Message { get; set; }
        public DateTime CheckedDate { get; set; }
    }
}
