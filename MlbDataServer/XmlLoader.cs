using System;
using System.IO;
using System.Net;
using System.Xml.Serialization;

namespace MlbDataServer
{
    public class DataLoader
    {
        public string GetString(string url)
        {
            var stringData = "";

            try
            {
                var request = (HttpWebRequest) WebRequest.Create(url);
                request.KeepAlive = true;
                request.Timeout = 30 * 60 * 1000;
                request.UseDefaultCredentials = true;
                request.Proxy.Credentials = request.Credentials;
                var response = request.GetResponse();

                using (var stream = response.GetResponseStream())
                {
                    if (stream == null) return stringData;

                    try
                    {
                        var reader = new StreamReader(stream);
                        stringData = reader.ReadToEnd();

                        reader.Close();
                    }
                    catch (Exception e)
                    {
                    }
                }
            }
            catch (Exception e)
            {
            }

            return stringData;
        }
    }

    public class XmlLoader
    {
        public T GetXml<T>(string url)
        {
            T deserializedData = default(T);

            try
            {
                var request = (HttpWebRequest) WebRequest.Create(url);
                request.KeepAlive = true;
                request.Timeout = 30 * 60 * 1000;
                request.UseDefaultCredentials = true;
                request.Proxy.Credentials = request.Credentials;
                var response = request.GetResponse();

                var serializer = new XmlSerializer(typeof(T));
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
                        throw e;
                    }
                }
            }
            catch (Exception e)
            {
                throw e;
            }


            return deserializedData;
        }
    }
}