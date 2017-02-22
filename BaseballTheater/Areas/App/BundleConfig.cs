using System.Web.Optimization;

namespace BaseballTheater.Areas.App
{
	public static class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new StyleBundle("~/stylebundles/app")
				.IncludeDirectory("~/Areas/App/Styles/", "*.css", true));

			bundles.Add(new ScriptBundle("~/scriptbundles/app")
				.IncludeDirectory("~/Areas/App/Scripts/", "*.js", true));
		}
	}
}