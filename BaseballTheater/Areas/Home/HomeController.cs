using System;
using System.Web.Mvc;
using BaseballTheater.Areas.Home.Models;

namespace BaseballTheater.Areas.Home
{
	public class HomeController : Controller
	{
		[OutputCache(Duration = 1)]
		public ActionResult Index(string id = "")
		{
			var dateString = id;
			if (dateString == "")
			{
				var endingDay2016String = "20161102";
				var openingDay2017String = "20170402";

				DateTime openingDay2017 = DateTime.ParseExact(openingDay2017String, "yyyyMMdd", null);

				var today = DateTime.UtcNow.AddHours(-8);

				dateString = today >= openingDay2017 
					? today.ToString("yyyyMMdd") 
					: endingDay2016String;
			}

			var model = new HomeModel(Request, dateString);

			return View(model);
		}
	}
}
