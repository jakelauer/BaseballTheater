using System.Web.Mvc;
using System.Web.Optimization;

namespace BaseballTheater.Areas.App
{
	public class AppAreaRegistration : AreaRegistration 
	{
		public override string AreaName => "App";

		public override void RegisterArea(AreaRegistrationContext context)
		{
			BundleConfig.RegisterBundles(BundleTable.Bundles);

			context.MapRoute(
				"App_gamelist",
				"{id}",
				new { controller = AreaName, action = "Index", id = UrlParameter.Optional },
				new[] { "BaseballTheater.Areas.App" }
			);

			context.MapRoute(
				"App_default",
				"{*url}",
				new { controller = AreaName, action = "Index", id = UrlParameter.Optional },
				new[] { "BaseballTheater.Areas.App" }
			);
		}
	}
}