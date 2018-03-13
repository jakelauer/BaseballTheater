using System;
using System.Web;
using System.Web.Mvc;
using BaseballTheater.Areas.Auth.Models;

namespace BaseballTheater.Areas.Auth
{
	public class AuthController : BTController
	{
		public ActionResult Index(string code)
		{
			if (!string.IsNullOrWhiteSpace(code))
			{
				var patreonCookie = new HttpCookie(AuthContext.PatreonAuthCookieName, code)
				{
					Expires = DateTime.UtcNow.AddDays(14),
					HttpOnly = true,
					Secure = true
				};
				Response.SetCookie(patreonCookie);
			}

			return RedirectToAction("Index", "App", new { area = "App" });
		}

		public ActionResult Logout()
		{
			var existingCookie = Response.Cookies[AuthContext.PatreonAuthCookieName];
			if (existingCookie != null)
			{
				existingCookie.Expires = DateTime.UtcNow.AddDays(-1);
				Response.SetCookie(existingCookie);
			}

			return RedirectToAction("Index", "App", new { area = "App" });
		}
	}
}
