using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace MlbDataServer.DataStructures
{
	public class Team
	{
		[XmlText]
		public string Name { get; set; }

		[XmlAttribute("team_id")]
		public long Id { get; set; }

	}
}