using System;
using System.Collections.Generic;
using System.IO;
using MlbDataEngine.Contracts;
using Newtonsoft.Json;

namespace MlbDataEngine.Engine
{
	public class HighlightDatabase
	{
		private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

		public static IEnumerable<HighlightSearchResult> AllHighlights { get; private set; }

		public static void Initialize()
		{
			LoadFiles();
		}

		private static void LoadFiles()
		{
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
		}
	}
}