using System;
using System.Xml.Serialization;

namespace MlbDataServer.Contracts
{
	[Serializable, XmlRoot("game")]
	public class GameCenter
	{
		[XmlAttribute("status")]
		public string Status { get; set; }

		[XmlAttribute("id")]
		public string Id { get; set; }

		[XmlElement("venueShort")]
		public string VenueShort { get; set; }

		[XmlElement("venueLong")]
		public string VenueLong { get; set; }

		[XmlElement("wrap")]
		public Wrap Wrap { get; set; }
	}

	public class Wrap
	{
		[XmlElement("mlb")]
		public Mlb Mlb { get; set; }
	}

	public class Mlb
	{
		[XmlElement("headline")]
		public string Headline { get; set; }

		[XmlElement("blurb")]
		public string Blurb { get; set; }
	}
}