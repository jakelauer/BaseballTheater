using System.Web.Mvc;

namespace Vanilla.Areas.Home
{
	public class HomeAreaRegistration : AreaRegistration 
	{
		public override string AreaName 
		{
			get 
			{
				return "Home";
			}
		}

		public override void RegisterArea(AreaRegistrationContext context)
		{
			context.MapRoute(
				"Home_default",
				"{action}/{id}",
				new { controller = "Home", action = "Index", id = UrlParameter.Optional },
				new[] { "Vanilla.Areas.Home" }
			);
		}
	}
}