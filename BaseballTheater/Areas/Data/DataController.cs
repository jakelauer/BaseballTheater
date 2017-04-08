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
	}
}
