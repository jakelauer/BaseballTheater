using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using MlbDataServer.Contracts;
using Newtonsoft.Json;

namespace MlbDataServer.Engine
{
	public class HighlightDatabase
	{
		public static IEnumerable<LocalHighlight> AllHighlights { get; private set; }

		public static void Initialize()
		{
			LoadFiles();
		}

		private static void LoadFiles()
		{
			var allHighlights = new List<LocalHighlight>();

			foreach (var file in Directory.EnumerateFiles(@"C:\highlightdata", "*.json"))
			{
				var contents = File.ReadAllText(file);
				var highlightsInFile = JsonConvert.DeserializeObject<List<LocalHighlight>>(contents);
				allHighlights.AddRange(highlightsInFile);
			}

			AllHighlights = allHighlights;
		}
	}
}