using System;

namespace MlbDataServer.Contracts
{
	[Serializable]
	public class LocalHighlight
	{
		public long Id { get; set; }
		public DateTime Date { get; set; }
		public long TeamId { get; set; }
		public string TeamName { get; set; }
		public string PlayerIds { get; set; }
		public string PlayerNames { get; set; }
		public string Headline { get; set; }
		public string Duration { get; set; }
		public string Blurb { get; set; }
		public string BigBlurb { get; set; }
		public string Thumb_s { get; set; }
		public string Thumb_m { get; set; }
		public string Thumb_l { get; set; }
		public string Video_s { get; set; }
		public string Video_m { get; set; }
		public string Video_l { get; set; }
		public long GameId { get; set; }
	}
}