﻿using System.ComponentModel.DataAnnotations;

namespace DowntimeAlerter.MVC.DTO
{
    public class UserDTO
    {
        [Required] public string Username { get; set; }

        [Required] public string Password { get; set; }
        [Required] public int Id { get; set; }
    }
}