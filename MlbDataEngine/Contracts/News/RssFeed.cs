using System;
using System.Collections.Generic;
using System.Globalization;
using System.Xml.Serialization;

namespace MlbDataEngine.Contracts.News
{
	[Serializable, XmlRoot("rss")]
	public class RssFeed
	{
		[XmlElement("channel")]
		public RssChannel RssChannel { get; set; }

		public RssFeed()
		{
			
		}

		public RssFeed(AtomFeed atomFeed)
		{
			this.RssChannel = new RssChannel();

			if (atomFeed != null)
			{
				RssChannel.Link = atomFeed.Link;
				RssChannel.RssImage = new RssImage();
				RssChannel.RssImage.Url = atomFeed.ImageUrl;
				RssChannel.Title = atomFeed.Title;
				var rssItems = new List<RssItem>();

				foreach (var item in atomFeed.Items)
				{
					var newRssItem = new RssItem();
					newRssItem.Link = item.LinkHref;
					newRssItem.Description = item.Content;
					newRssItem.NewsFeed = NewsFeeds.reddit.ToString();
					newRssItem.PubDateString = item.PubDateString;
					newRssItem.Title = item.Title;

					rssItems.Add(newRssItem);
				}

				RssChannel.RssItems = rssItems.ToArray();
			}
		}
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