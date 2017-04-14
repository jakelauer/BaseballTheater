using JavaScriptEngineSwitcher.Core;
using JavaScriptEngineSwitcher.V8;

namespace BaseballTheater
{
	public class JsEngineSwitcherConfig
	{
		public static void Configure(JsEngineSwitcher engineSwitcher)
		{
			var v8ef = new V8JsEngineFactory();
			engineSwitcher.EngineFactories.Add(v8ef);

			engineSwitcher.DefaultEngineName = v8ef.EngineName;
		}
	}
}