using System.Web;
using System.Web.Optimization;

namespace BaseballTheater
{
	public class BundleConfig
	{
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/lib").Include(
						"~/Shared/Scripts/libraries/modernizr-*",
						"~/Shared/Scripts/libraries/jquery*"));

			bundles.Add(new StyleBundle("~/stylebundles/main")
				.IncludeDirectory("~/Shared/Styles/", "*.css"));

			bundles.Add(new StyleBundle("~/stylebundles/game")
				.IncludeDirectory("~/Areas/Game/Styles/", "*.css"));

			bundles.Add(new StyleBundle("~/stylebundles/home")
				.IncludeDirectory("~/Areas/Home/Styles/", "*.css"));
		}
	}
}
