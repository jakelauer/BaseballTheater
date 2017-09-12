using System.Web.Optimization;

namespace BaseballTheater.Areas.App
{
	public static class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/scriptbundles/app")
				.IncludeDirectory("~/Areas/App/Scripts/Site", "*.js", true)
				.IncludeDirectory("~/Areas/App/Scripts/Components", "*.js", true)
				.IncludeDirectory("~/Areas/App/Scripts/Helpers", "*.js", true)
				.IncludeDirectory("~/Areas/App/Scripts/", "*.js", false));
		}
	}
}