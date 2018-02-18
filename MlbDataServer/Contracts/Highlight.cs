using System;
using System.Globalization;
using System.Linq;
using System.Xml.Serialization;

namespace MlbDataServer.Contracts
{
	[Serializable, XmlRoot("media")]
	public class Highlight
	{
		[XmlAttribute("type")]
		public string Type { get; set; }

		[XmlAttribute("id")]
		public long Id { get; set; }

		[XmlAttribute("date")]
		public string Date { get; set; }

		[XmlElement("player")]
		public Players Players { get; set; }

		[XmlElement("team")]
		public Team Team { get; set; }

		public DateTime DateObj => DateTime.Parse(Date, CultureInfo.InvariantCulture);

		[XmlElement("headline")]
		public string Headline { get; set; }

		[XmlElement("blurb")]
		public string Blurb { get; set; }

		[XmlElement("bigblurb")]
		public string BigBlurb { get; set; }

		[XmlElement("duration")]
		public string Duration { get; set; }

		[XmlElement("url")]
		public string[] Urls { get; set; }

		[XmlElement("thumb")]
		public string Thumb { get; set; }

		[XmlArray("thumbnails")]
		[XmlArrayItem("thumb")]
		public string[] Thumbs { get; set; }

		[XmlArray("keywords")]
		[XmlArrayItem("keyword")]
		public Keyword[] Keywords { get; set; }

		[XmlAttribute("condensed")]
		public bool Condensed { get; set; }

		[XmlAttribute("recap")]
		public bool Recap { get; set; }

		public string GetGameDetailDirectory
		{
			get
			{
				var keyword = this.Keywords.FirstOrDefault(a => a.Type == "game_events_location_plist");
				if (keyword != null)
				{
					var gameEventsLocationPlist = keyword.Value;
					var splitDirectory = gameEventsLocationPlist.Split('/');
					splitDirectory = splitDirectory.Take(splitDirectory.Length - 1).ToArray();
					var rootDirectory = string.Join("/", splitDirectory);
					return rootDirectory;
				}

				return null;
			}
		}
	}

}