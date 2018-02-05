using BundleTransformer.Core.Builders;
using BundleTransformer.Core.Orderers;
using BundleTransformer.Core.Resolvers;
using BundleTransformer.Core.Transformers;
using System.Web.Optimization;

namespace BaseballTheater
{
	public class BundleConfig
	{
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{
			BundleResolver.Current = new CustomBundleResolver();

			var libraries = new ScriptBundle("~/scriptbundles/lib")
				.Include("~/Shared/Scripts/libraries/react.js")
				.Include("~/Shared/Scripts/libraries/react-dom.js")
				.Include("~/Shared/Scripts/libraries/remarkable.min.js")
				.Include("~/Shared/Scripts/libraries/Flux.js")
				.Include("~/Shared/Scripts/libraries/FluxUtils.js")
				.Include("~/Shared/Scripts/libraries/cookies.js")
				.Include("~/Shared/Scripts/libraries/jquery-3.js")
				.Include("~/Shared/Scripts/libraries/jquery.signalR-2.2.2.min.js")
				.Include("~/Shared/Scripts/libraries/modernizr-2.6.2.js")
				.Include("~/Shared/Scripts/libraries/moment-lib.js")
				.Include("~/Shared/Scripts/libraries/moment-timezone.js")
				.Include("~/Shared/Scripts/libraries/pikaday.js")
				.Include("~/Shared/Scripts/libraries/x2js.js");

			bundles.Add(libraries);

			var scssBundle = new Bundle("~/stylebundles/scss")
			{
				Builder = new NullBuilder(),
				Orderer = new NullOrderer()
			};
			scssBundle.Transforms.Add(new StyleTransformer());
			scssBundle.IncludeDirectory("~/", "*.scss", true);
			scssBundle.IncludeDirectory("~/", "*.css", true);
			bundles.Add(scssBundle);
		}
	}
}