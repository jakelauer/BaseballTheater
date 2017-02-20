using System.Web.Optimization;

namespace BaseballTheater.Areas.Home
{
	public static class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new StyleBundle("~/stylebundles/home")
				.IncludeDirectory("~/Areas/Home/Styles/", "*.css"));

			bundles.Add(new ScriptBundle("~/scriptbundles/home")
				.IncludeDirectory("~/Areas/Home/Scripts/", "*.js"));
		}
	}
}