using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaseballTheaterCore.Controllers
{
    [Route("[controller]")]
    public class AuthController : BtController
    {
        [HttpGet("[action]")]
        public IActionResult Login(string returnUrl = "/")
        {
            return Challenge(new AuthenticationProperties() {RedirectUri = returnUrl}, "Patreon");
        }
        
        [HttpGet("[action]")]
        [Authorize]
        public async Task Logout()
        {
            // Sign the user out of the cookie authentication middleware (i.e. it will clear the local session cookie)
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            HttpContext.Response.Redirect("/");
        }
    }
}