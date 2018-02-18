using System;
using System.Xml.Serialization;

namespace MlbDataServer.Contracts
{
	[Serializable]
	public class Linescore
	{
		[XmlElement("inning")]
		public Inning[] Innings { get; set; }

		[XmlElement("r")]
		public Runs Runs { get; set; }

		[XmlElement("h")]
		public Hits Hits { get; set; }

		[XmlElement("e")]
		public Errors Errors { get; set; }
	}

	[Serializable]
	public class Inning : HomeAway
	{
	}

	[Serializable]
	public class Runs : HomeAway
	{
	}

	[Serializable]
	public class Hits : HomeAway
	{
	}

	[Serializable]
	public class Errors : HomeAway
	{
	}

	[Serializable]
	public class HomeAway
	{
		[XmlAttribute("home")]
		public string Home { get; set; }

		[XmlAttribute("away")]
		public string Away { get; set; }
	}

	[Serializable]
	public class GameStatus
	{
		[XmlAttribute("status")]
		public string Status { get; set; }
	}

	public enum League
	{
		AA,
		NN
	}
}
