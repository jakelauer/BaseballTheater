using System.Web.Mvc;
using System.Web.Optimization;

namespace BaseballTheater.Areas.Auth
{
	public class AuthAreaRegistration : AreaRegistration 
	{
		public override string AreaName => "Auth";

		public override void RegisterArea(AreaRegistrationContext context)
		{
			//BundleConfig.RegisterBundles(BundleTable.Bundles);

			context.MapRoute(
				"auth_default",
				"Auth/{action}",
				new { controller = AreaName, action = "Index", id = UrlParameter.Optional },
				new[] { "BaseballTheater.Areas.Auth" }
			);
		}
	}
}