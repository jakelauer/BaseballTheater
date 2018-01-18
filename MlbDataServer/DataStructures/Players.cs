using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace MlbDataServer.DataStructures
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