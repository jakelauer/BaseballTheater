using System.Web.Optimization;

namespace BaseballTheater
{
	public class BundleConfig
	{
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{


			var libraries = new ScriptBundle("~/scriptbundles/lib")
				.Include("~/Shared/Scripts/libraries/cookies.js")
				.Include("~/Shared/Scripts/libraries/jquery-3.js")
				.Include("~/Shared/Scripts/libraries/modernizr-2.6.2.js")
				.Include("~/Shared/Scripts/libraries/moment-lib.js")
				.Include("~/Shared/Scripts/libraries/moment-timezone.js")
				.Include("~/Shared/Scripts/libraries/pikaday.js")
				.Include("~/Shared/Scripts/libraries/x2js.js");

#if DEBUG
			libraries.Include("~/Shared/Scripts/libraries/vue.dev.js");
#else
			libraries.Include("~/Shared/Scripts/libraries/vue.prod.js");
#endif

			bundles.Add(libraries);

			bundles.Add(new ScriptBundle("~/scriptbundles/mlbdataserver")
				.IncludeDirectory("~/Shared/Scripts/MlbDataServer", "*.js", true));

			bundles.Add(new ScriptBundle("~/scriptbundles/site")
				.IncludeDirectory("~/Shared/Scripts/Site", "*.js", true));
		}
	}
}