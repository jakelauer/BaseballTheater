using System;
using System.Xml.Serialization;

namespace MlbDataServer.Contracts
{
	[Serializable]
	public class Players
	{
		[XmlText]
		public string Names { get; set; }

		[XmlAttribute("player_id")]
		public string Ids { get; set; }
	}
}