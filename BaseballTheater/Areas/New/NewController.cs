using System;
using System.Web.Mvc;
using BaseballTheater.Areas.Home.Models;

namespace BaseballTheater.Areas.New
{
	public class NewController : Controller
	{
		[OutputCache(Duration = 120)]
		public ActionResult Index()
        {
			return View();
		}
	}
}
