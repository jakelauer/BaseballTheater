using System.Web.Mvc;

namespace BaseballTheater.Areas.App
{
	public class AppController : Controller
	{
		[OutputCache(Duration = 60)]
		public ActionResult Index(string id = "")
		{
			return View();
		}
	}
}
