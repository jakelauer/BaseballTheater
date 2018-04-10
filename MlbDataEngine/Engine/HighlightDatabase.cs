using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using MlbDataEngine.Contracts;
using Newtonsoft.Json;

namespace MlbDataEngine.Engine
{
	public static class HighlightDatabase
	{
		private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

		public static IEnumerable<HighlightSearchResult> AllHighlights { get; private set; }
		private static Timer HighlightTimer { get; set; }

		public static void Initialize()
		{
			HighlightTimer?.Dispose();
			LoadFiles();
		}

		private static void LoadTimer(object _ = null)
		{
			var hour = new TimeSpan(1, 0, 0);
			HighlightTimer = new Timer(a => LoadFiles(), null, Convert.ToInt32(hour.TotalMilliseconds), 0);
		}

		private static void LoadFiles()
		{
			HighlightTimer?.Dispose();
			var allHighlights = new List<HighlightSearchResult>();

			try
			{
				foreach (var file in Directory.EnumerateFiles(@"C:\highlightdata", "*.json"))
				{
					var contents = File.ReadAllText(file);
					var highlightsInFile = JsonConvert.DeserializeObject<List<HighlightSearchResult>>(contents);
					allHighlights.AddRange(highlightsInFile);
				}
			}
			catch (Exception e)
			{
				log.Error("Exception occured loading highlight data", e);
			}

			AllHighlights = allHighlights;
			
			ThreadPool.QueueUserWorkItem(LoadTimer, null);
		}
	}
}