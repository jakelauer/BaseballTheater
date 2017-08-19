using BaseballTheater.Areas.Data.Models.Patreon;
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

		public ActionResult News()
		{
			var model = new NewsModel();
			model.PopulateModel();

			return View(model);
		}
	}
}
