using System;
using System.Xml.Serialization;

namespace MlbDataEngine.Contracts.News
{
	[Serializable, XmlRoot("feed", Namespace = "http://www.w3.org/2005/Atom")]
	public class AtomFeed
	{
		[XmlElement("title")]
		public string Title { get; set; }

		[XmlElement("link")]
		public string Link { get; set; }

		[XmlElement("description")]
		public string Description { get; set; }

		[XmlElement("icon")]
		public string ImageUrl { get; set; }

		[XmlElement("entry")]
		public FeedItem[] Items { get; set; }

	}
}