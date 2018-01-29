using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Populator
{
	internal class Program
	{
		private static DateTime Date = new DateTime(2015, 7, 25);
		private static bool DoLoop = false;

		private static void Main(string[] args)
		{
			if (args.Length > 0)
			{
				try
				{
					Date = DateTime.ParseExact(args[0], "yyyyMMdd", CultureInfo.CurrentCulture);
				}
				catch (Exception)
				{
					Date = DateTime.UtcNow.AddDays(-1);
				}
			}

			if (args.Length > 1)
			{
				DoLoop = bool.Parse(args[1]);
			}
			Loop();
		}

		private static void Loop()
		{
			var processGame = new LoadHighlights(Date);
			processGame.Process();

			Date = Date.AddDays(1);
			if (Date > DateTime.UtcNow)
			{
				return;
			}

			if (DoLoop)
			{
				Loop();
			}
		}
	}
}
