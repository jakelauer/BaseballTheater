using System.Web.Mvc;
using System.Web.Routing;
using BaseballTheater.Extensions;

namespace BaseballTheater
{
	public class MvcApplication : System.Web.HttpApplication
	{
		protected void Application_Start()
		{
			ViewEngines.Engines.Clear();
			var viewEngine = new CustomViewEngine();
			ViewEngines.Engines.Add(viewEngine);

			AreaRegistration.RegisterAllAreas();
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
		}
	}
}
