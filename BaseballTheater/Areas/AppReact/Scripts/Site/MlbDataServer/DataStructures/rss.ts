namespace Theater
{
	export interface IRssFeed
	{
		rss: IRss;
	}

	export interface IRss
	{
		channel: IRssChannel;
	}

	export interface IRssChannel
	{
		title: string;
		link: string;
		image: IRssImage;
		item: IRssItem[];
	}

	export interface IRssImage
	{
		href: string;
	}

	export interface IRssItem
	{
		title: string;
		link: string;
		pubDate: string;
		pubDateObj: moment.Moment;
	}

	export class RssFeed implements IRssFeed
	{
		public rss: IRss;

		constructor(feed: IRssFeed)
		{
			this.rss = feed.rss;
			if (this.rss.channel && this.rss.channel.item)
			{
				for (var item of this.rss.channel.item)
				{
					item.pubDateObj = moment(item.pubDate);
				}
			}
		}
	}
}