using System;
using System.IO;
using System.Net;
using System.Xml.Serialization;
using NLog;

namespace MlbDataServer
{
	public class XmlLoader
	{
		private static Logger Logger = LogManager.GetCurrentClassLogger();

		public T GetXml<T>(string url)
		{
			T deserializedData = default(T);

			Logger.Info(url);

			try
			{
				var request = (HttpWebRequest)WebRequest.Create(url);
				request.KeepAlive = true;
				request.Timeout = 30*60*1000;
				request.UseDefaultCredentials = true;
				request.Proxy.Credentials = request.Credentials;
				var response = request.GetResponse();

				var serializer = new XmlSerializer(typeof (T));
				using (var stream = response.GetResponseStream())
				{
					if (stream == null) return deserializedData;

					try
					{
						var reader = new StreamReader(stream);
						deserializedData = (T) serializer.Deserialize(reader);

						reader.Close();
					}
					catch (Exception e)
					{
						Logger.Error(e);
					}
				}
			}
			catch (Exception e)
			{
				Logger.Error(e);
			}


			return deserializedData;
		}
	}
}