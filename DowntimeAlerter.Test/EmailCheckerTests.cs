using DowntimeAlerter.Core.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DowntimeAlerter.Test
{
    public class EmailCheckerTests
    {
        [Fact]
        public void Email_Correct_Format_Check()
        {
            //arrange act
            string email = "necipbaser71@gmail.com";

            //assert
            Assert.Equal(EmailChecker.IsValidEmail(email), true);
        }

        [Fact]
        public void Email_Wrong_Format_Check()
        {
            //arrange act
            string email = "necipbaser71.gmail.com";

            //assert
            Assert.Equal(EmailChecker.IsValidEmail(email), false);
        }
    }
}
