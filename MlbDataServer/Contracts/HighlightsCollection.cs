using System;
using System.Xml.Serialization;

namespace MlbDataServer.Contracts
{
	[Serializable, XmlRoot("highlights")]
	public class HighlightsCollection
	{
		[XmlElement("media")]
		public Highlight[] Highlights { get; set; }
	}
}