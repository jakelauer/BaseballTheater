using System.Xml.Serialization;

namespace MlbDataServer.Contracts
{
	public class Keyword
	{
		[XmlAttribute("type")]
		public string Type { get; set; }

		[XmlAttribute("value")]
		public string Value { get; set; }
	}
}