using AutoMapper;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.MVC.DTO;
using DowntimeAlerter.MVC.Mapping;
using Xunit;

namespace DowntimeAlerter.Test
{
    public class SiteEmailModelMappingTests
    {
        [Fact]
        public void SiteEmail_To_SiteEmailDTO_Model_Mapper_Check()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
            var mapper = config.CreateMapper();

            //arrange act
            SiteEmail siteEmail = new SiteEmail();
            siteEmail.Id = 1;
            siteEmail.SiteId = 1;
            siteEmail.Email = "necipbaser71@gmail.com";

            //assert
            var siteEmailDTO = mapper.Map<SiteEmail, SiteEmailDTO>(siteEmail);
            Assert.Equal(siteEmailDTO.Id, siteEmail.Id);
            Assert.Equal(siteEmailDTO.SiteId, siteEmail.SiteId);
            Assert.Equal(siteEmailDTO.Email, siteEmail.Email);
        }
    }
}
