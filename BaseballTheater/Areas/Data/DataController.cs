using BaseballTheater.Areas.Data.Models.News;
using System.Web.Mvc;

namespace BaseballTheater.Areas.Data
{
	public class DataController : Controller
	{
		[OutputCache(Duration = 300)]
		public ActionResult Patreon()
		{
			return View();
		}

		[OutputCache(Duration = 60)]
		public ActionResult News(string feeds = "")
		{
			var feedList = feeds.Split(',');

			var model = new NewsModel(feedList);
			model.PopulateModel();

			return View(model);
		}
	}
}
