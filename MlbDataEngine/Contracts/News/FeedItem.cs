using System;
using System.Globalization;
using System.Xml.Serialization;

namespace MlbDataEngine.Contracts.News
{
	/// <summary>
	/// Generic feed item object that contains some basic properties. The feed item is typically
	/// an article or a blog post. If a property is not available
	/// for a specific feed type (e.g. Rss 1.0), then the property is empty.
	/// If a feed item has more properties, like the Generator property for Rss 2.0, then you can use
	/// the <see cref="SpecificItem"/> property.
	/// </summary>

	[Serializable]
	public class FeedItem
	{
		[XmlElement("title")]
		public string Title { get; set; }

		[XmlElement("link")]
		public Link Link { get; set; }

		public string LinkHref => Link.Href;

		[XmlElement("content")]
		public string Content { get; set; }

		[XmlElement("updated")]
		public string PubDateString { get; set; }

		/// <summary>
		/// The published date as datetime. Null if parsing failed or if
		/// no publishing date is set. If null, please check <see cref="PublishingDateString"/> property.
		/// </summary>
		public DateTime? PubDate {
			get
			{
				DateTime? parsedDate = null;
				var pubDateStringReplaced = PubDateString.Replace("EDT", "-4").Replace("\n\t", "");
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
						parsedDate = DateTime.ParseExact(pubDateStringReplaced, "yyyy-mm-ddTHH:mm:sszzz", CultureInfo.InvariantCulture);
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

	[Serializable]
	public class Link
	{
		[XmlAttribute("href")]
		public string Href { get; set; }
	}
}