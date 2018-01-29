using System.Threading;
using System.Web.Mvc;
using BaseballTheater.Hubs;

namespace BaseballTheater.Areas.App
{
	public class AppController : Controller
	{
		[OutputCache(Duration = 60)]
		public ActionResult Index(string id = "")
		{
			var myThread = new Thread(this.SendMessage);
			myThread.Start();

			return View();
		}

		private void SendMessage()
		{
			Thread.Sleep(10000);

			LiveGameHub.ClientsInstance.All.receive("lol");
		}
	}
}
