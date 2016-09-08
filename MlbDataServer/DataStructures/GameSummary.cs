using System;
using System.Globalization;
using System.Xml.Serialization;

namespace MlbDataServer.DataStructures
{
	[Serializable, XmlRoot("game")]
	public class GameSummary
	{
		[XmlAttribute("id")]
		public string Id { get; set; }

		[XmlAttribute("game_pk")]
		public int GamePk { get; set; }

		[XmlAttribute("time_date")]
		public string Date { get; set; }

		[XmlAttribute("game_type")]
		public string GameType { get; set; }

		[XmlAttribute("time")]
		public string EventTime { get; set; }

		[XmlAttribute("ampm")]
		public string EventTimeAmPm { get; set; }

		[XmlAttribute("time_zone")]
		public string TimeZone { get; set; }

		public DateTime DateObj
		{
			get
			{
				try
				{
					return Date != null ? DateTime.Parse(Date, CultureInfo.InvariantCulture) : DateTime.UtcNow;
				}
				catch
				{
					return DateTime.UtcNow;
				}
			}
		}

		[XmlElement("status")]
		public GameStatus Status { get; set; }

		[XmlAttribute("league")]
		public string League { get; set; }

		[XmlAttribute("inning")]
		public string Inning { get; set; }

		[XmlAttribute("away_name_abbrev")]
		public string AwayTeamNameAbbr { get; set; }

		[XmlAttribute("away_team_name")]
		public string AwayTeamName { get; set; }

		[XmlAttribute("away_file_code")]
		public string AwayFileCode { get; set; }

		[XmlAttribute("home_name_abbrev")]
		public string HomeTeamNameAbbr { get; set; }

		[XmlAttribute("home_team_name")]
		public string HomeTeamName { get; set; }

		[XmlAttribute("home_file_code")]
		public string HomeFileCode { get; set; }

		[XmlAttribute("game_data_directory")]
		public string GameDataDirectory { get; set; }

		[XmlElement("linescore")]
		public Linescore Linescore { get; set; }
	}
}