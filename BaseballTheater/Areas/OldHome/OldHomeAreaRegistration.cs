using System.Web.Mvc;
using System.Web.Optimization;

namespace BaseballTheater.Areas.OldHome
{
	public class OldHomeAreaRegistration : AreaRegistration 
	{
		public override string AreaName 
		{
			get 
			{
				return "OldHome";
			}
		}

		public override void RegisterArea(AreaRegistrationContext context)
		{
			BundleConfig.RegisterBundles(BundleTable.Bundles);

			context.MapRoute(
				"oldHome_default",
				"oldHome/{id}",
				new { controller = AreaName, action = "Index", id = UrlParameter.Optional },
				new[] { "BaseballTheater.Areas.OldHome" }
			);
		}
	}
}