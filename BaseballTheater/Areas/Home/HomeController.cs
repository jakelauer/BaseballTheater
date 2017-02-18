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
            var isOpeningDay = false;
            if (dateString == "")
            {
                var endingDay2016String = "20161102";
                var openingDay2017String = "20170402";

                DateTime openingDay2017 = DateTime.ParseExact(openingDay2017String, "yyyyMMdd", null);

                var today = DateTime.UtcNow.AddHours(-8);

                if (today >= openingDay2017)
                {
                    dateString = today.ToString("yyyyMMdd");

                    isOpeningDay = dateString == openingDay2017String;
                }
                else
                {
                    dateString = endingDay2016String;
                }
            }

			var dateTime = DateTime.ParseExact(dateString, "yyyyMMdd", null);

			var model = new HomeModel(dateTime, Request)
            {
                isOpeningDay = isOpeningDay
            };

			return View(model);

		}
	}
}
