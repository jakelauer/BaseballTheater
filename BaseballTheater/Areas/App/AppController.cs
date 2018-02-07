using System.Threading;
using System.Web.Mvc;
using BaseballTheater.Hubs;

namespace BaseballTheater.Areas.App
{
	public class AppController : Controller
	{
		[OutputCache(Duration = 60)]
		public ActionResult Index()
		{
			return View();
		}
	}
}
