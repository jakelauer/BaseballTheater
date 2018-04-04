using System;
using System.Collections.Generic;
using System.Net;
using BaseballTheaterCore.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using MlbDataEngine.Contracts;
using Microsoft.AspNetCore.Http;

namespace BaseballTheaterCore.Controllers
{
    [Route("[controller]")]
    public class AuthController : Controller
    {
        [HttpGet("[action]")]
        public void Index(string code)
        {
            if (!string.IsNullOrWhiteSpace(code))
            {
                var options = new CookieOptions()
                {
                    Expires = DateTime.UtcNow.AddDays(14),
                    HttpOnly = true,
                    Secure = true
                };

                this.Response.Cookies.Append(AuthContext.PatreonAuthCookieName, code, options);
            }
        }

        [HttpGet("[action]")]
        public IActionResult Login(string returnUrl = "/")
        {
            return Challenge(new AuthenticationProperties() {RedirectUri = returnUrl});
        }
    }
}