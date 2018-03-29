using System;
using System.Threading;
using System.Web;
using BaseballTheater.Extensions;
using JavaScriptEngineSwitcher.Core;
using JavaScriptEngineSwitcher.V8;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using BaseballTheater.Areas.Auth.Models;
using MlbDataEngine.Engine;

namespace BaseballTheater
{
	public class MvcApplication : System.Web.HttpApplication
	{
		protected void Application_Start()
		{
			//Thread.Sleep(10000);

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
			log4net.Config.XmlConfigurator.Configure();
		}

		public override string GetVaryByCustomString(HttpContext context, string arg) 
		{ 
			if (arg.Equals("User", StringComparison.InvariantCultureIgnoreCase))
			{
				var authCookie = context.Request.Cookies[AuthContext.PatreonAuthCookieName];
				if (authCookie != null)
				{
					return authCookie.Value;
				}

				return "";
			}

			return base.GetVaryByCustomString(context, arg); 
		}
	}
}
