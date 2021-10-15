﻿using System.Net.Mail;

namespace DowntimeAlerter.Core.Utilities
{
    public static class EmailChecker
    {
        public static bool IsValidEmail(string email)
        {
            try
            {
                var addr = new MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}