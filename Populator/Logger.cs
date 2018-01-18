using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Populator
{
	class Logger
	{
		public static void Log(string text)
		{
			// Create a writer and open the file:
			StreamWriter log;

			var path = @".\logfile.txt";
			if (!File.Exists(path))
			{
				log = new StreamWriter(path);
			}
			else
			{
				log = File.AppendText(path);
			}

			var value = DateTime.Now + " | " + text;
			log.WriteLine(value);
			Console.WriteLine(value);

			log.Close();
		}
	}
}