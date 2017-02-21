using System.Web;
using System.Web.Optimization;

namespace BaseballTheater
{
	public class BundleConfig
	{
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/lib")
				.IncludeDirectory("~/Shared/Scripts/libraries", "*.js", true));

			bundles.Add(new StyleBundle("~/stylebundles/main")
				.IncludeDirectory("~/Shared/Styles/", "*.css"));

			bundles.Add(new ScriptBundle("~/scriptbundles/mlbdataserver")
				.IncludeDirectory("~/Shared/Scripts/MlbDataServer", "*.js", true));

			bundles.Add(new ScriptBundle("~/scriptbundles/site")
				.IncludeDirectory("~/Shared/Scripts/Site", "*.js", true));
		}
	}
}
