using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.Core.Services;
using DowntimeAlerter.Core.Utilities;
using DowntimeAlerter.MVC.ActionFilters;
using DowntimeAlerter.MVC.DTO;
using Microsoft.Extensions.Logging;

namespace DowntimeAlerter.MVC.Controllers
{
    [ServiceFilter(typeof(LoginFilterAttribute))]
    public class AdminController : Controller
    {
        private readonly ILogger<AdminController> _logger;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        public AdminController(IUserService userService, IMapper mapper,ILogger<AdminController> logger)
        {
            _mapper = mapper;
            _userService = userService;
            _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult AddUser()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsers();
                var userResources = _mapper.Map<IEnumerable<User>, IEnumerable<UserDTO>>(users);
                return Json(new { data = userResources });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Json(new { data = false });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateUser(UserDTO model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    if (model.Username.Length<3)
                        return Json(new { success = false, msg = "Username must be at least 3 characters!" });
                    if (model.Password.Length < 5)
                        return Json(new { success = false, msg = "Password must be at least 6 characters!" });
                    var md5Password = SecurePasswordHasher.CalculateMD5Hash(model.Password);
                    model.Password = md5Password;
                    var userToCreate = _mapper.Map<UserDTO, User>(model);
                    var checkUser = _userService.GetUserByUserName(userToCreate);
                    if(checkUser.Result!=null)
                        return Json(new { success = false, msg = "The user was already added." });
                    userToCreate.Name = string.Empty;
                    var newSite = await _userService.CreateUser(userToCreate);
                    if (newSite != null)
                        return Json(new { success = true, msg = "The site was added." });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.Message);
                }
            }
            return Json(new { success = false, msg = "Error" });
        }
    }
}
