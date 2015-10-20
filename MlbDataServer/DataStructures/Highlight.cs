using System;
using System.Xml.Serialization;

namespace MlbDataServer.DataStructures
{
	[Serializable, XmlRoot("media")]
	public class Highlight
	{
		[XmlAttribute("type")]
		public string Type { get; set; }

		[XmlAttribute("id")]
		public long Id { get; set; }

		[XmlAttribute("date")]
		public string Date { get; set; }

		[XmlElement("headline")]
		public string Headline { get; set; }

		[XmlElement("blurb")]
		public string Blurb { get; set; }

		[XmlElement("duration")]
		public string Duration { get; set; }

		[XmlElement("url")]
		public string[] Urls { get; set; }

		[XmlElement("thumb")]
		public string Thumb { get; set; }

		[XmlArray("thumbnails")]
		[XmlArrayItem("thumb")]
		public string[] Thumbs { get; set; }

		[XmlArray("keywords")]
		[XmlArrayItem("keyword")]
		public Keyword[] Keywords { get; set; }
	}

}