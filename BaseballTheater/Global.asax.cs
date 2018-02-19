using System.Threading;
using BaseballTheater.Extensions;
using JavaScriptEngineSwitcher.Core;
using JavaScriptEngineSwitcher.V8;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using MlbDataServer.Engine;

namespace BaseballTheater
{
	public class MvcApplication : System.Web.HttpApplication
	{
		protected void Application_Start()
		{
			Thread.Sleep(10000);

			ViewEngines.Engines.Clear();
			var viewEngine = new CustomViewEngine();
			ViewEngines.Engines.Add(viewEngine);

			AreaRegistration.RegisterAllAreas();
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			BundleConfig.RegisterBundles(BundleTable.Bundles);

			var v8Ef = new V8JsEngineFactory();
			JsEngineSwitcher.Instance.EngineFactories.Add(v8Ef);
			JsEngineSwitcher.Instance.DefaultEngineName = v8Ef.EngineName;

			HighlightDatabase.Initialize();
		}
	}
}
