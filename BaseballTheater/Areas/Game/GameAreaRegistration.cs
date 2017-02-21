using System.Web.Mvc;
using System.Web.Optimization;

namespace BaseballTheater.Areas.Game
{
	public class GameAreaRegistration : AreaRegistration 
	{
		public override string AreaName 
		{
			get 
			{
				return "Game";
			}
		}

		public override void RegisterArea(AreaRegistrationContext context)
		{
			BundleConfig.RegisterBundles(BundleTable.Bundles);

			context.MapRoute(
				"Game_default",
				"Game/{date}/{id}",
				new { controller = AreaName, action = "Index", id = UrlParameter.Optional },
				new[] { "BaseballTheater.Areas.Game" }
			);
		}
	}
}