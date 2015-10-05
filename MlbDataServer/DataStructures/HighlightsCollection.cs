using System;
using System.Xml.Serialization;

namespace MlbDataServer.DataStructures
{
	[Serializable, XmlRoot("highlights")]
	public class HighlightsCollection
	{
		[XmlElement("media")]
		public Highlight[] Highlights { get; set; }
	}
}