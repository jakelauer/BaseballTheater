using System.Web.Mvc;

namespace BaseballTheater.Areas.Proxy
{
	public class ProxyAreaRegistration : AreaRegistration 
	{
		public override string AreaName 
		{
			get 
			{
				return "Proxy";
			}
		}

		public override void RegisterArea(AreaRegistrationContext context) 
		{
			context.MapRoute(
				"Proxy_default",
				"Proxy/{action}/{id}",
				new { controller = "Proxy", action = "Index", id = UrlParameter.Optional }
			);
		}
	}
}