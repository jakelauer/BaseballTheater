namespace Theater
{
	interface ILink
	{
		url: string;
		label: string;
	}

	var getLinks = (game: IHighlight): ILink[] =>
	{
		const qkRegex = /(\d{4}K)/;
		var links = game.url;
		var validMp4Link: ILink = null;

		for (let link of links)
		{
			const matches = link.__text.match(qkRegex);
			if (matches && matches.length > 0)
			{
				const label = matches[0] as string;
				validMp4Link = {
					url: link.__text,
					label: label
				};
			}
		}

		var validLinks = [];

		if (validMp4Link !== null)
		{
			const q1800K = {
				url: validMp4Link.url.replace(qkRegex, "1800K"),
				label: "1800K"
			};

			const q2500K = {
				url: validMp4Link.url.replace(qkRegex, "2500K"),
				label: "2500K"
			};

			validLinks.push(validMp4Link, q1800K, q2500K);
		}

		return validLinks;
	};

	Vue.component("highlight",
	{
		template: $("template#highlight").html(),
		props: ["highlight"],
		methods: {
			getLinks,
			getDefaultUrl: (highlight: IHighlight) =>
			{
				var links = getLinks(highlight);
				var returnLink: ILink = null;
				if (links.length > 2)
				{
					returnLink = links[1];
				}

				returnLink = links[links.length - 1];

				return returnLink.url;
			},
			getDefaultThumb: (highlight: IHighlight) =>
			{
				if (highlight.thumbnails != null && highlight.thumbnails.thumb != null && highlight.thumbnails.thumb.length > 0)
				{
					const thumbs = highlight.thumbnails.thumb;

					return thumbs[thumbs.length - 2];
				}

				return highlight.thumb;
			},
			playVideo: (event: Event) =>
			{
				var $playCover = $(event.currentTarget);
				var $video = $playCover.siblings("video");
				($video[0] as HTMLVideoElement).play();
			},
			pauseVideo: (event: Event) =>
			{
				var video = event.currentTarget as HTMLVideoElement;
				video.pause();
			},
			onPlay: (highlight: IHighlight) =>
			{
				highlight.isPlaying = true;
			},
			onPause: (highlight: IHighlight) =>
			{
				highlight.isPlaying = false;
			}
		}
	});
}