using BaseballTheater.Areas.Proxy.Models;
using MlbDataServer;
using System.Net;
using System.Web.Mvc;

namespace BaseballTheater.Areas.Proxy.Controllers
{
	public class ProxyController : Controller
	{
		// GET: Proxy/Proxy
		public ActionResult Index(string mlbUrl, bool isJson = false)
		{
			var url = WebUtility.UrlDecode(mlbUrl);
			var loader = new DataLoader();
			var data = loader.GetString(url);

			var model = new ProxyModel(data, isJson);
			return View(model);
		}
	}
}