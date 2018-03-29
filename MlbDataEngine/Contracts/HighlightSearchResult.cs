using System;
using System.Linq;

namespace MlbDataEngine.Contracts
{
	[Serializable]
	public class HighlightSearchResult
	{
		public Highlight Highlight { get; set; }
		public HighlightThumbnails Thumbnails { get; set; }
		public long GameId { get; set; }
	}
	
	[Serializable]
	public class HighlightThumbnails
	{
		public string High { get; set; }
		public string Med { get; set; }
		public string Low { get; set; }

		public static HighlightThumbnails Make(Highlight highlight)
		{
			var ht = new HighlightThumbnails();
			if (highlight?.thumbnails != null && highlight.thumbnails.Any())
			{
				ht.Low = highlight.thumbnails.FirstOrDefault(a => a.EndsWith("51.jpg"))
						  ?? highlight.thumbnails.FirstOrDefault();

				ht.Med = highlight.thumbnails.FirstOrDefault(a => a.EndsWith("49.jpg"))
				         ?? ht.Low;

				ht.High = highlight.thumbnails.FirstOrDefault(a => a.EndsWith("48.jpg") || a.EndsWith("53.jpg"))
				          ?? ht.Med;

			}
			return ht;
		}
	}
}