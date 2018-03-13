using System.Threading;
using System.Web.Mvc;
using BaseballTheater.Areas.Auth.Models;
using BaseballTheater.Hubs;

namespace BaseballTheater.Areas.App
{
	public class AppController : BTController
	{
		[OutputCache(Duration = 60, VaryByCustom = "User")]
		public ActionResult Index()
		{
			return View();
		}
	}
}
