using BaseballTheater.Extensions;
using JavaScriptEngineSwitcher.Core;
using JavaScriptEngineSwitcher.V8;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

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
			BundleConfig.RegisterBundles(BundleTable.Bundles);

			var v8ef = new V8JsEngineFactory();
			JsEngineSwitcher.Instance.EngineFactories.Add(v8ef);

			JsEngineSwitcher.Instance.DefaultEngineName = v8ef.EngineName;
		}
	}
}
