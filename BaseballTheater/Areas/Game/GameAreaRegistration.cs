using System.Web.Mvc;

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
			context.MapRoute(
				"Game_default",
				"Game/{date}/{id}",
				new { controller = AreaName, action = "Index", id = UrlParameter.Optional },
				new[] { "BaseballTheater.Areas.Game" }
			);
		}
	}
}