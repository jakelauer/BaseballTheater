using System.Web.Optimization;

namespace BaseballTheater.Areas.AppReact
{
	public static class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/scriptbundles/appreact")
				.IncludeDirectory("~/Areas/AppReact/Scripts/", "*.js", true));
		}
	}
}