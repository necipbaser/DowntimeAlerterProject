using System;
using AutoMapper;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.MVC.DTO;
using DowntimeAlerter.MVC.Mapping;
using System;
using Xunit;
using DowntimeAlerter.Core.Enums;

namespace DowntimeAlerter.Test
{
    public class NotificationLogModelMappingTests
    {
        [Fact]
        public void NotificationLog_To_NotificationLogDTO_Model_Mapper_Check()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
            var mapper = config.CreateMapper();

            //arrange act
            NotificationLog log = new NotificationLog();
            log.Id = 1;
            log.NotificationType = NotificationType.Email;
            log.Message = "Message";
            log.SiteName = "Google";
            log.CheckedDate = DateTime.Now;
            log.State = "Up";

            //assert
            var notificationLogDTO = mapper.Map<NotificationLog, NotificationLogDTO>(log);
            Assert.Equal(notificationLogDTO.Id, log.Id);
            Assert.Equal(notificationLogDTO.Message, log.Message);
            Assert.Equal(notificationLogDTO.NotificationType, log.NotificationType);
            Assert.Equal(notificationLogDTO.CheckedDate, log.CheckedDate);
            Assert.Equal(notificationLogDTO.State, log.State);
            Assert.Equal(notificationLogDTO.SiteName, log.SiteName);
        }
    }
}
