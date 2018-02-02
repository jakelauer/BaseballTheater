namespace Theater.GameDetail
{
	interface ILink
	{
		url: string;
		label: string;
	}

	interface IHighlightProps
	{
		highlight: IHighlight;
	}

	export class Highlight extends React.Component<IHighlightProps, any>
	{
		private getDefaultThumb()
		{
			const highlight = this.props.highlight;

			const thumbFinal = highlight.thumbnails.thumb[1].__text;
			return thumbFinal.replace("http:", location.protocol);
		}

		private getDefaultUrl()
		{
			const links = this.getLinks();

			const link1800 = links.find((value) =>
			{
				return !!value.url.match("1800K");
			});

			if (link1800)
			{
				return link1800.url;
			}

			return links[links.length - 1].url;
		}

		private getTitle()
		{
			const highlight = this.props.highlight;

			if (highlight.recap)
			{
				return "Recap";
			}

			if (highlight.condensed)
			{
				return "Condensed Game";
			}

			const teamCode = MlbDataServer.Teams.TeamIdList[parseInt(highlight.team_id)] || "";
			return (
				<div className={`highlight-title`}>
					<span className={`team`}>{teamCode.toUpperCase()}</span>
					<span className={`title`}>{highlight.headline}</span>
				</div>);
		}

		private getLinks(): ILink[]
		{
			const qkRegex = /(\d{4}K)/;
			const links = this.props.highlight.url;
			let q1200k: ILink = null;

			// For some reason, Safari doesn't like this particular 
			// variable when it's a 'let' when it's minified. 
			// ReSharper disable once VariableCanBeMadeLet
			for (var link of links)
			{
				const matches = link.__text.match(qkRegex);
				if (matches && matches.length > 0)
				{
					q1200k = {
						url: link.__text.replace("http:", location.protocol),
						label: "low"
					};
				}
			}

			const validLinks: ILink[] = [];

			if (q1200k !== null)
			{
				const q1800K = {
					url: q1200k.url.replace(qkRegex, "1800K").replace("http:", location.protocol),
					label: "mid"
				};

				const q2500K = {
					url: q1200k.url.replace(qkRegex, "2500K").replace("http:", location.protocol),
					label: "high"
				};

				validLinks.push(q1200k, q1800K, q2500K);
			}

			return validLinks;
		}

		public render()
		{
			const thumbStyle = { backgroundImage: `url(${this.getDefaultThumb()})` };

			const links = this.getLinks().map((link, i) =>
			{
				return <a href={link.url} key={i}>{link.label}</a>;
			});

			return (
				<div className={`highlight`}>
					<div className={`video-info`}>
						<a href={this.getDefaultUrl()} target={`_blank`}>
							<div className={`thumb`} style={thumbStyle }>

							</div>
							<h2>{this.getTitle()}</h2>
						</a>
					</div>
					<div className={`links`}>
						{links}
					</div>
				</div>
			);
		}
	}
}