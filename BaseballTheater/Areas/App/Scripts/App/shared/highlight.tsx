namespace Theater
{
	interface IHighlightProps
	{
		renderDate: boolean;
		highlight: IHighlight | IHighlightSearchResult;
	}

	export class Highlight extends React.Component<IHighlightProps, any>
	{
		private get highlight()
		{
			return (this.props.highlight as IHighlightSearchResult).Highlight || (this.props.highlight as IHighlight);
		}

		private renderTitle()
		{
			const displayProps = HighlightUtility.getDisplayProps(this.highlight);

			if (!displayProps)
			{
				return <div/>;
			}

			const teamCode = Teams.TeamIdList[parseInt(displayProps.teamId)] || "";
			return (
				<div className={`highlight-title`}>
					<span className={`team`}>{teamCode.toUpperCase()}</span>
					<span className={`title`}>{displayProps.headline}</span>
				</div>);
		}

		private getLink(label: string, url: string): ILink
		{
			return {
				url,
				label
			}
		}

		public render()
		{
			const displayProps = HighlightUtility.getDisplayProps(this.highlight);

			if (!displayProps)
			{
				return <div/>;
			}

			const thumbStyle = { backgroundImage: `url(${displayProps.thumb})` };

			const links = displayProps.links.map((link, i) =>
			{
				return <a href={link.url} key={i}>{link.label}</a>;
			});

			const dateString = moment(this.highlight.date).format("MMM D, YYYY");
			const dateRendered = this.props.renderDate
				                     ? <div className={`date`}>
					                       {dateString}
				                       </div>
				                     : null;

			return (
				<div className={`highlight`}>
					<div className={`video-info`}>
						<a href={displayProps.videoUrl} target={`_blank`}>
							<div className={`thumb`} style={thumbStyle}>

							</div>
							<h2>{this.renderTitle()}</h2>
						</a>
					</div>
					{dateRendered}
					<div className={`links`}>
						{links}
					</div>
				</div>
			);
		}
	}
}