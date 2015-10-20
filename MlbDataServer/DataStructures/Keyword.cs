using System.Xml.Serialization;

namespace MlbDataServer.DataStructures
{
	public class Keyword
	{
		[XmlAttribute("type")]
		public string Type { get; set; }

		[XmlAttribute("value")]
		public string Value { get; set; }
	}
}