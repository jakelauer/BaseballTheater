using System.Web.Mvc;

namespace BaseballTheater.Areas.Home
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
				"{id}",
				new { controller = AreaName, action = "Index", id = UrlParameter.Optional },
				new[] { "BaseballTheater.Areas.Home" }
			);
		}
	}
}