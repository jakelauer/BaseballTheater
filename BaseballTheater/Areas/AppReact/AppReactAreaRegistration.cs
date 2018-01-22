using System.Web.Mvc;
using System.Web.Optimization;

namespace BaseballTheater.Areas.AppReact
{
	public class AppReactAreaRegistration : AreaRegistration 
	{
		public override string AreaName => "AppReact";

		public override void RegisterArea(AreaRegistrationContext context)
		{
			BundleConfig.RegisterBundles(BundleTable.Bundles);

			context.MapRoute(
				"appreact_gamelist",
				"react/{id}",
				new { controller = AreaName, action = "Index", id = UrlParameter.Optional },
				new[] { "BaseballTheater.Areas.AppReact" }
			);

			context.MapRoute(
				"appreact_default",
				"react/{*url}",
				new { controller = AreaName, action = "Index", id = UrlParameter.Optional },
				new[] { "BaseballTheater.Areas.AppReact" }
			);
		}
	}
}