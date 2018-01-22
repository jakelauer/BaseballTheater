using System.Web.Mvc;

namespace BaseballTheater.Areas.AppReact
{
	public class AppReactController : Controller
	{
		[OutputCache(Duration = 60)]
		public ActionResult Index(string id = "")
		{
			return View();
		}
	}
}
