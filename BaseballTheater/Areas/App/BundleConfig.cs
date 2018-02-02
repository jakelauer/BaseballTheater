using System.Web.Optimization;

namespace BaseballTheater.Areas.App
{
	public static class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/scriptbundles/App")
				.IncludeDirectory("~/Areas/App/Scripts/Site", "*.js", true)
				.IncludeDirectory("~/Areas/App/Scripts/App", "*.js", true));
		}
	}
}