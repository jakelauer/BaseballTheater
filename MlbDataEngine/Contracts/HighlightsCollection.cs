using System;
using System.Xml.Serialization;

namespace MlbDataEngine.Contracts
{
	[Serializable, XmlRoot("highlights")]
	public class HighlightsCollection
	{
		[XmlElement("media")]
		public Highlight[] Highlights { get; set; }
	}
}