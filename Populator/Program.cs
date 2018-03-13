using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
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
		[Option('m', "mode", Required = false, Default = 0)]
		public Mode Mode { get; set; }

		[Option('d', "date", Required = false, HelpText = "Must be in the format yyyyMMdd")]
		public string DateString { get; set; }

		[Option('l', "loop", HelpText = "If true, the program will go to the next day after this day is over", Default = true)]
		public bool LoopDates { get; set; }
	}

	internal class Program
	{
		private static DateTime _date;
		private static List<DateTime> HandledDates = new List<DateTime>();
		private static bool LoopDates = false;
		private static bool loadNext = true;

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
				_date = DateTime.ParseExact(options.DateString, "yyyyMMdd", CultureInfo.CurrentCulture);
			}
			catch (Exception)
			{
				_date = DateTime.UtcNow.AddDays(-4);
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
			var taskCount = 8;
			var tasks = new List<Task>();
			for (var i = 0; i < taskCount; i++)
			{
				var i1 = i;
				var dateToHandle = _date.AddDays(i1 + 1);
				var task = Task.Factory.StartNew(() => DoLoadHighlightsForDate(dateToHandle));
				tasks.Add(task);
			}

			_date = _date.AddDays(taskCount);

			var allTasks = tasks.ToArray();
			if (allTasks != null && allTasks.All(a => a != null))
			{
				Task.WaitAll(tasks.ToArray());
			}

			loadNext = _date <= DateTime.UtcNow && LoopDates;

			if (loadNext)
			{
				LoadHighlights();
			}
		}

		private static void DoLoadHighlightsForDate(DateTime date)
		{
			var processGame = new LoadHighlights(date);
			processGame.Process();
		}

		private static void HandleLiveGames()
		{

		}
	}
}