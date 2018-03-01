using System;

namespace MlbDataServer.Contracts
{
	[Serializable]
	public class HighlightSearchResult
	{
		public Highlight Highlight { get; set; }
		public long GameId { get; set; }
	}
}