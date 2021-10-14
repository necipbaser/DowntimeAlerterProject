using AutoMapper;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.MVC.DTO;

namespace DowntimeAlerter.MVC.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Domain to Resource
            CreateMap<SiteEmail, SiteEmailDTO>();
            CreateMap<Site, SiteDTO>();
            CreateMap<User, UserDTO>();
            CreateMap<Log, LogDTO>();
            CreateMap<NotificationLog, NotificationLogDTO>();

            // Resource to Domain
            CreateMap<SiteEmailDTO, SiteEmail>();
            CreateMap<SiteDTO, Site>();
            CreateMap<UserDTO, User>();
            CreateMap<LogDTO, Log>();
            CreateMap<NotificationLogDTO, NotificationLog>();

            //CreateMap<SaveSiteEmailDTO, SiteEmail>();
            //CreateMap<SaveSiteDTO, Site>();
        }
    }
}
