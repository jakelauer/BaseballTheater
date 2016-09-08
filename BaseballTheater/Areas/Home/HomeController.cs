using System;
using System.Web.Mvc;
using BaseballTheater.Areas.Home.Models;

namespace BaseballTheater.Areas.Home
{
	public class HomeController : Controller
	{
		[OutputCache(Duration = 120)]
		public ActionResult Index(string id = "")
		{
			var dateString = id;
			if (dateString == "")
			{
				var today = DateTime.UtcNow.AddHours(-8);
				dateString = today.ToString("yyyyMMdd");
			}

			var dateTime = DateTime.ParseExact(dateString, "yyyyMMdd", null);

			var model = new HomeModel(dateTime, Request);

			return View(model);

		}
	}
}
