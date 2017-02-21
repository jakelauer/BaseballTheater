using System.Web.Mvc;

namespace BaseballTheater.Areas.App
{
	public class AppController : Controller
	{
		[OutputCache(Duration = 1)]
		public ActionResult Index(string id = "")
		{
			return View();
		}
	}
}
