using System.Web.Mvc;
using System.Web.Optimization;

namespace BaseballTheater.Areas.Home
{
	public class HomeAreaRegistration : AreaRegistration 
	{
		public override string AreaName => "Home";

		public override void RegisterArea(AreaRegistrationContext context)
		{
			BundleConfig.RegisterBundles(BundleTable.Bundles);

			context.MapRoute(
				"home_default",
				"{id}",
				new { controller = AreaName, action = "Index", id = UrlParameter.Optional },
				new[] { "BaseballTheater.Areas.Home" }
			);
		}
	}
}