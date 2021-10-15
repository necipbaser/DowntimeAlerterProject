using DowntimeAlerter.Core.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DowntimeAlerter.Test
{
    public class UrlCheckerTests
    {
        [Fact]
        public void Url_Correct_Format_Check()
        {
            //arrange act
            string url = "https://www.google.com";

            //assert
            Assert.Equal(UrlChecker.CheckUrl(url),true);
        }

        [Fact]
        public void Url_Wrong_Format_Check()
        {
            //arrange act
            string url = "www.google.com";

            //assert
            Assert.Equal(UrlChecker.CheckUrl(url), false);
        }
    }
}
