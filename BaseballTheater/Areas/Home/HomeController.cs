using System.Web.Mvc;

namespace BaseballTheater.Areas.Home
{
	public class HomeController : Controller
	{
		public ActionResult Index(string blogName, long since = 0, long start = 0)
		{
			var model = new HomeModel(since, start);

			return View(model);

		}
	}
}
