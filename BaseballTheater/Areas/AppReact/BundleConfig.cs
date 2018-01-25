using System.Web.Optimization;

namespace BaseballTheater.Areas.AppReact
{
	public static class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/scriptbundles/appreact")
				.IncludeDirectory("~/Areas/AppReact/Scripts/Site", "*.js", true)
				.IncludeDirectory("~/Areas/AppReact/Scripts/App", "*.js", true));
		}
	}
}