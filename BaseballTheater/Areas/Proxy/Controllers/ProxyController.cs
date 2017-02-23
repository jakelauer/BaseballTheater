using BaseballTheater.Areas.Proxy.Models;
using MlbDataServer;
using System.Net;
using System.Web.Mvc;

namespace BaseballTheater.Areas.Proxy.Controllers
{
	public class ProxyController : Controller
	{
		// GET: Proxy/Proxy
		public ActionResult Index(string mlbUrl)
		{
			var url = WebUtility.UrlDecode(mlbUrl);
			var xmlLoader = new XmlLoader();
			var xml = xmlLoader.GetXmlString(url);

			var model = new ProxyModel(xml);
			return View(model);
		}
	}
}