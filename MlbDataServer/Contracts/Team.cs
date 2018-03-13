using System.Xml.Serialization;

namespace MlbDataServer.Contracts
{
	public class Team
	{
		[XmlText]
		public string Name { get; set; }

		[XmlAttribute("team_id")]
		public long Id { get; set; }

	}
}