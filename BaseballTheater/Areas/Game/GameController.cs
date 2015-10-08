using BaseballTheater.Areas.Game.Models;
using System;
using System.Globalization;
using System.Web.Mvc;

namespace BaseballTheater.Areas.Game
{
	public class GameController : Controller
	{
		[OutputCache(Duration = 60)]
		public ActionResult Index(string date, int id)
		{
			var dateTime = DateTime.ParseExact(date, "yyyyMMdd", CultureInfo.InvariantCulture);

			var model = new GameModel(dateTime, id);

			return View(model);
		}
	}
}
