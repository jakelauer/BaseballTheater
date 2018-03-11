using System;
using System.Globalization;
using System.Linq;
using System.Xml.Serialization;

namespace MlbDataServer.Contracts
{
	[Serializable, XmlRoot("media")]
	public class Highlight
	{
		[XmlAttribute("type")]
		public string type { get; set; }

		[XmlAttribute("id")]
		public long id { get; set; }

		[XmlAttribute("date")]
		public string date { get; set; }

		[XmlElement("player")]
		public Players players { get; set; }

		[XmlElement("team")]
		public Team team { get; set; }

		public DateTime dateObj => DateTime.Parse(date, CultureInfo.InvariantCulture);

		[XmlElement("headline")]
		public string headline { get; set; }

		[XmlElement("blurb")]
		public string blurb { get; set; }

		[XmlElement("bigblurb")]
		public string bigblurb { get; set; }

		[XmlElement("duration")]
		public string duration { get; set; }

		[XmlElement("url")]
		public string[] url { get; set; }

		[XmlElement("thumb")]
		public string thumb { get; set; }

		[XmlArray("thumbnails")]
		[XmlArrayItem("thumb")]
		public string[] thumbnails { get; set; }

		[XmlArray("keywords")]
		[XmlArrayItem("keyword")]
		public Keyword[] keywords { get; set; }

		[XmlAttribute("condensed")]
		public bool condensed { get; set; }

		[XmlAttribute("recap")]
		public bool recap { get; set; }
	}

}