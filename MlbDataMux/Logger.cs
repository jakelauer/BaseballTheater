using System;
using System.IO;

namespace MlbDataMux
{
	internal class Logger
	{
		private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

		public static void Log(string text)
		{
			// Create a writer and open the file:
			StreamWriter filelog;

			var value = DateTime.Now + " | " + text;
			
			Console.WriteLine(value);

			log.Info(text);

			/*var path = @".\logfile.txt";
			if (!File.Exists(path))
			{
				log = new StreamWriter(path);
			}
			else
			{
				log = File.AppendText(path);
			}

			log.WriteLine(value);
			log.Close();*/


		}
	}
}