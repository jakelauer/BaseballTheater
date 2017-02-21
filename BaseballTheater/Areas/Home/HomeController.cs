using System;
using System.Web.Mvc;

namespace BaseballTheater.Areas.Home
{
	public class HomeController : Controller
	{
		[OutputCache(Duration = 1)]
		public ActionResult Index(string id = "")
		{
			return View();
		}
	}
}
