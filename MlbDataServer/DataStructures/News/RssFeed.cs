using System;
using System.Globalization;
using System.Xml.Serialization;

namespace MlbDataServer.DataStructures.News
{
	[Serializable, XmlRoot("rss")]
	public class RssFeed
	{
		[XmlElement("channel")]
		public RssChannel RssChannel { get; set; }
	}

	[Serializable]
	public class RssChannel
	{
		[XmlElement("title")]
		public string Title { get; set; }

		[XmlElement("link")]
		public string Link { get; set; }

		[XmlElement("image", IsNullable = true)]
		public RssImage RssImage { get; set; }

		[XmlElement("item")]
		public RssItem[] RssItems { get; set; }
	}

	public class RssImage
	{
		[XmlElement("url")]
		public string Url { get; set; }
	}

	public class RssItem
	{
		public string NewsFeed { get; set; }

		[XmlElement("title")]
		public string Title { get; set; }

		[XmlElement("description")]
		public string Description { get; set; }

		[XmlElement("image")]
		public string Image { get; set; }

		[XmlElement("link")]
		public string Link { get; set; }

		[XmlElement("pubDate")]
		public string PubDateString { get; set; }

		public DateTime? PubDate
		{
			get
			{
				DateTime? parsedDate = null;
				var pubDateStringReplaced = PubDateString.Replace("EDT", "-4").Replace("EST", "-4").Replace("\n\t", "");
				try
				{
					parsedDate = DateTime.Parse(pubDateStringReplaced, CultureInfo.InvariantCulture);
				}
				catch
				{
					// ignored
				}

				if (parsedDate == null)
				{
					try
					{
						parsedDate = DateTime.ParseExact(pubDateStringReplaced, "ddd, d MMM yyyy HH:mm:ss z", CultureInfo.InvariantCulture);
					}
					catch
					{
						// ignored
					}
				}

				return parsedDate;
			}
		}
	}
}