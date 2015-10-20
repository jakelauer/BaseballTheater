using System;
using System.IO;
using System.Net;
using System.Xml.Serialization;

namespace MlbDataServer
{
	public class XmlLoader
	{
		public T GetXml<T>(string url)
		{
			T deserializedData = default(T);

			try
			{
				var request = WebRequest.Create(url);
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
						Console.Write(e);
					}
				}
			}
			catch (Exception e)
			{
				Console.Write(e);
			}


			return deserializedData;
		}
	}
}