﻿using DowntimeAlerter.Core;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Services;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace DowntimeAlerter.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        public UserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<User> GetUserAsync(User user)
        {
            return await _unitOfWork.Users.GetUserAsync(user);
        }
    }
}
