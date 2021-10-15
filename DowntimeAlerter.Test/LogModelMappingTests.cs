using AutoMapper;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.MVC.DTO;
using DowntimeAlerter.MVC.Mapping;
using System;
using Xunit;

namespace DowntimeAlerter.Test
{
    public class LogModelMappingTests
    {
        [Fact]
        public void User_To_UserDTO_Model_Mapper_Check()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
            var mapper = config.CreateMapper();

            //arrange act
            Log log = new Log();
            log.Id = 1;
            log.Level = "Up";
            log.Message = "Message";
            log.MessageTemplate = "MessageTemplate";
            log.TimeStamp = DateTime.Now;
            log.Exception = "Exception";

            //assert
            var logDTO = mapper.Map<Log, LogDTO>(log);
            Assert.Equal(logDTO.Id, log.Id);
            Assert.Equal(logDTO.Level, log.Level);
            Assert.Equal(logDTO.MessageTemplate, log.MessageTemplate);
            Assert.Equal(logDTO.TimeStamp, log.TimeStamp);
            Assert.Equal(logDTO.Exception, log.Exception);
        }
    }
}
