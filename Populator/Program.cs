using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Populator
{
	class Program
	{
		static DateTime Date = new DateTime(2015, 7, 25);
		private static bool DoLoop = false;

		static void Main(string[] args)
		{
			if (args.Length > 0)
			{
				Date = DateTime.ParseExact(args[0], "yyyyMMdd", CultureInfo.CurrentCulture);
			}

			if (args.Length > 1)
			{
				DoLoop = Boolean.Parse(args[1]);
			}
			Loop();
		}

		static void Loop()
		{
			var processGame = new ProcessGame(Date);
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
