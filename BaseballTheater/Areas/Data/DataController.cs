using BaseballTheater.Areas.Data.Models.News;
using System.Web.Mvc;
using System.Threading.Tasks;
using MlbDataServer.Engine;

namespace BaseballTheater.Areas.Data
{
	public class DataController : Controller
	{
		[OutputCache(Duration = 300)]
		public ActionResult Patreon()
		{
			return View();
		}

		[OutputCache(Duration = 60)]
		public ActionResult News(string feeds = "", string favTeam = "")
		{
			var feedList = feeds.Split(',');

			var model = new NewsModel(feedList, favTeam);
			model.PopulateModel();

			return View(model);
		}

		public ActionResult SearchHighlights(string query, int page, int perpage)
		{
			var result = Search.SearchHighlights(query, page, perpage);
			return View(result);
		}

		public async Task<ActionResult> GetRealTimeEvents(string subscribeToKey)
		{
		//	var rte = await RealTimeEvents.GetRealTimeEvents(subscribeToKey);
			return View();
		}
	}
}
