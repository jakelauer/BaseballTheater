using System.Web.Optimization;

namespace BaseballTheater.Areas.OldHome
{
	public static class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new StyleBundle("~/stylebundles/oldhome")
				.IncludeDirectory("~/Areas/OldHome/Styles/", "*.css"));

			bundles.Add(new ScriptBundle("~/scriptbundles/oldhome")
				.IncludeDirectory("~/Areas/OldHome/Scripts/", "*.js"));
		}
	}
}