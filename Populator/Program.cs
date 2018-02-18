using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CommandLine;
using MlbDataMux;

namespace Populator
{
	internal enum Mode
	{
		PopulateHighlights,
		PopulateGames,
		HandleLiveGames
	}

	class Options
	{
		[Option('m', "mode", Required = true)]
		public Mode Mode { get; set; }

		[Option('d', "date", Required = false, HelpText = "Must be in the format yyyyMMdd")]
		public string DateString { get; set; }

		[Option('l', "loop", Default = false, HelpText = "If true, the program will go to the next day after this day is over")]
		public bool LoopDates { get; set; }

		[Option('i', "interval", Default = 10, HelpText = "The number of seconds to wait between checking something")]
		public int CheckIntervalSeconds { get; set; }
	}

	internal class Program
	{
		private static DateTime Date = new DateTime(2015, 7, 25);
		private static bool LoopDates = false;

		private static void Main(string[] args)
		{
			Parser.Default.ParseArguments<Options>(args)
				.WithParsed(onParsed)
				.WithNotParsed(onParseFail);
		}

		private static void onParsed(Options options)
		{
			LoopDates = options.LoopDates;

			try
			{
				Date = DateTime.ParseExact(options.DateString, "yyyyMMdd", CultureInfo.CurrentCulture);
			}
			catch (Exception)
			{
				Date = DateTime.UtcNow.AddDays(-1);
			}

			switch (options.Mode)
			{
				case Mode.PopulateHighlights:
					LoadHighlights();
					break;
				case Mode.PopulateGames:
					break;
				case Mode.HandleLiveGames:
					break;
				default:
					throw new ArgumentOutOfRangeException();
			}

			if (options.LoopDates)
			{
			}
		}

		private static void onParseFail(IEnumerable<Error> errors)
		{
			foreach (var error in errors)
			{
				Console.WriteLine($"Error parsing option: {error}");
			}
		}

		private static void LoadHighlights()
		{
			var loadNext = true;	
			while (loadNext)
			{
				var processGame = new LoadHighlights(Date);
				processGame.Process();

				Date = Date.AddDays(1);
				if (Date > DateTime.UtcNow || !LoopDates)
				{
					loadNext = false;
				}
			}
		}

		private static void HandleLiveGames()
		{

		}
	}
}