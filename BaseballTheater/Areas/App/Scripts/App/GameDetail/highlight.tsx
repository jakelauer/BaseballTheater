namespace Theater.GameDetail
{

	interface IHighlightProps
	{
		highlight: IHighlight;
	}

	export class Highlight extends React.Component<IHighlightProps, any>
	{
		private renderTitle()
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

			const teamCode = Teams.TeamIdList[parseInt(highlight.team_id)] || "";
			return (
				<div className={`highlight-title`}>
					<span className={`team`}>{teamCode.toUpperCase()}</span>
					<span className={`title`}>{highlight.headline}</span>
				</div>);
		}

		public render()
		{
			const thumbStyle = { backgroundImage: `url(${HighlightUtility.getDefaultThumb(this.props.highlight)})` };

			const links = HighlightUtility.getLinks(this.props.highlight).map((link, i) =>
			{
				return <a href={link.url} key={i}>{link.label}</a>;
			});

			return (
				<div className={`highlight`}>
					<div className={`video-info`}>
						<a href={HighlightUtility.getDefaultUrl(this.props.highlight)} target={`_blank`}>
							<div className={`thumb`} style={thumbStyle }>

							</div>
							<h2>{this.renderTitle()}</h2>
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