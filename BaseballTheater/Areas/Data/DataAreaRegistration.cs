using System.Web.Mvc;
using System.Web.Optimization;

namespace BaseballTheater.Areas.Data
{
	public class DataAreaRegistration : AreaRegistration 
	{
		public override string AreaName => "Data";

		public override void RegisterArea(AreaRegistrationContext context)
		{
			BundleConfig.RegisterBundles(BundleTable.Bundles);

			context.MapRoute(
				"data_default",
				"Data/{action}",
				new { controller = AreaName, action = "Index", id = UrlParameter.Optional },
				new[] { "BaseballTheater.Areas.Data" }
			);
		}
	}
}