using System.Web.Mvc;
using System.Web.Optimization;

namespace BaseballTheater.Areas.New
{
	public class NewAreaRegistration : AreaRegistration 
	{
		public override string AreaName 
		{
			get 
			{
				return "New";
			}
		}

		public override void RegisterArea(AreaRegistrationContext context)
		{
			BundleConfig.RegisterBundles(BundleTable.Bundles);

			context.MapRoute(
				"New_default",
				"new/{id}",
				new { controller = AreaName, action = "Index", id = UrlParameter.Optional },
				new[] { "BaseballTheater.Areas.New" }
			);
		}
	}
}