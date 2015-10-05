using BaseballTheater.Areas.Home.Models;
using System;
using System.Globalization;
using System.Web.Mvc;

namespace BaseballTheater.Areas.Home
{
	public class HomeController : Controller
	{
		public ActionResult Index(string id = "")
		{
			var dateString = id;
			if (dateString == "")
			{
				var today = DateTime.Now;
				dateString = today.ToString("yyyyMMdd");
			}

			var dateTime = DateTime.ParseExact(dateString, "yyyyMMdd", CultureInfo.InvariantCulture);

			var model = new HomeModel(dateTime);

			return View(model);

		}
	}
}
