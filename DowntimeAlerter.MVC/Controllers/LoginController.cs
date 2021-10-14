using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DowntimeAlerter.Core.Services;
using DowntimeAlerter.Core.Models;
using DowntimeAlerter.MVC.DTO;
using AutoMapper;
using Microsoft.AspNetCore.Http;

namespace DowntimeAlerter.MVC.Controllers
{
    public class LoginController : Controller
    {
        private readonly ILogger<LoginController> _logger;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public LoginController(ILogger<LoginController> logger,IUserService userService, IMapper mapper)
        {
            _mapper = mapper;
            _userService = userService;
            _logger = logger;
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> Login(UserDTO model)
        {
            if (model.Username == "" || model.Password=="")
                return Json(new { success = true, msg = "Please enter username and password.!" });
            var user = _mapper.Map<UserDTO, User>(model);
            try
            {
                var returnUser = await _userService.GetUserAsync(user);
                if (returnUser != null)
                {
                    //add cookie and return
                    CookieOptions option = new CookieOptions();
                    option.Expires = DateTime.Now.AddMinutes(60);
                    Response.Cookies.Append("id", returnUser.Id.ToString(), option);
                    return Json(new { success = true, msg = string.Empty });
                }
                else
                    return Json(new { success = false,msg="Username or password is incorrect!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return Json(new { success = true, msg = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("id");
            return RedirectToAction("Login");
        }
    }
}
