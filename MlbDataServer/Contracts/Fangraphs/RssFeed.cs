using System;
using System.Globalization;
using System.Xml.Serialization;

namespace MlbDataServer.DataStructures.Fangraphs
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
		[XmlElement("title")]
		public string Title { get; set; }

		[XmlElement("link")]
		public string Link { get; set; }

		[XmlElement("pubDate")]
		public string PubDateString { get; set; }

		public DateTime PubDate
		{
			get
			{
				try
				{
					return PubDateString != null ? DateTime.Parse(PubDateString, CultureInfo.InvariantCulture) : DateTime.UtcNow;
				}
				catch
				{
					return DateTime.UtcNow;
				}
			}
		}
	}
}