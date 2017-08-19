using MlbDataServer.DataFetch;
using MlbDataServer.DataStructures.Fangraphs;
using System.Collections.Generic;
using System.Linq;

namespace BaseballTheater.Areas.Data.Models.Patreon
{
	public class NewsModel
	{
		public IEnumerable<RssItem> Items { get; set; }

		public void PopulateModel()
		{
			var feedCreator = new NewsFeedCreator();
			var fgFeed = feedCreator.GetFangraphsFeed();
			var mlbFeed = feedCreator.GetMlbFeed();

			if (fgFeed.RssChannel != null && mlbFeed != null)
			{
				var both = new List<RssItem>(fgFeed.RssChannel.RssItems)
					.Concat(mlbFeed.RssChannel.RssItems);

				both = both.OrderByDescending(a => a.PubDate);

				this.Items = both;
			}
		}
	}
}