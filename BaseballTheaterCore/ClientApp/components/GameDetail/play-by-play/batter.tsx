import React = require("react");
import {IAtBat, IHighlight, IHighlightsCollection, IPitch, IPitcher, Keyword} from "../../../MlbDataServer/Contracts";
import {HighlightUtility} from "../../shared/highlight_utility";
import {PlayByPlayPitches} from "./play_by_play_pitches";

interface IBatterProps
{
	isSpringTraining: boolean;
	highlights: IHighlightsCollection | null;
	batter: IAtBat | null,
	batterIndex: number,
	oldPitcher: IPitcher | null,
	newPitcher: IPitcher | null;
}

interface IBatterState
{
	isExpanded: boolean;
}

export class Batter extends React.Component<IBatterProps, IBatterState>
{
	constructor(props: IBatterProps)
	{
		super(props);

		this.state = {
			isExpanded: false
		};
	}

	private static getSvIdsForPlay(play: IAtBat)
	{
		if (play.pitch)
		{
			return play.pitch.map(a => a.sv_id);
		}

		return [];
	}

	private getHighlightForPlay(play: IAtBat): IHighlight | null
	{
		const guid = play.play_guid;
		const svIds = Batter.getSvIdsForPlay(play);
		const hc = this.props.highlights;
		let foundHighlight: IHighlight | null = null;
		if (hc && hc.highlights && hc.highlights.media)
		{
			const highlights = hc.highlights.media instanceof Array
				? hc.highlights.media
				: [(hc.highlights.media as any) as IHighlight];

			const matching = highlights.find(highlight =>
			{
				let found = false;
				if (highlight.keywords && highlight.keywords.keyword)
				{
					const keywords = highlight.keywords.keyword instanceof Array
						? highlight.keywords.keyword
						: ([highlight.keywords.keyword] as any) as Keyword[];

					keywords.forEach(keyword =>
					{
						found = found || (keyword.type === "sv_id" && (keyword.value === guid || svIds.indexOf(keyword.value) > -1));
					});
				}
				return found;
			});

			if (matching)
			{
				foundHighlight = matching;
			}
		}

		return foundHighlight;
	}

	private static renderPitch(pitch: IPitch, pitchIndex: number)
	{
		let rendered = <div/>;

		if (pitch)
		{
			rendered =
				<div className={`pitch`} key={pitchIndex} data-type={pitch.type}>
					<div className={`pitch-count`}>{pitchIndex + 1}</div>
					<div className={`pitch-description`}>{pitch.des}</div>
					<div className={`pitch-details`}>
						{pitch.start_speed} MPH {pitch.pitch_type_detail}
					</div>
				</div>;
		}

		return rendered;
	}

	private toggleExpandedState(e: React.MouseEvent<HTMLDivElement>)
	{
		this.setState({
			isExpanded: !this.state.isExpanded
		});
	}

	public render()
	{
		const batter = this.props.batter;
		const newPitcher = this.props.newPitcher;
		const oldPitcher = this.props.oldPitcher;
		const batterIndex = this.props.batterIndex;

		if (!batter)
		{
			return <div/>;
		}

		let pitches: JSX.Element[] = [];
		let strikezone = <div/>;
		if (batter && batter.pitch)
		{
			pitches = batter.pitch.map((pitch, i) =>
			{
				return Batter.renderPitch(pitch, i);
			});

			strikezone = <PlayByPlayPitches pitches={batter.pitch} isSpringTraining={this.props.isSpringTraining}/>;
		}

		const expandedClass = this.state.isExpanded ? "expanded" : "";
		const relatedHighlight = this.getHighlightForPlay(batter);
		const highlightHref = relatedHighlight ? HighlightUtility.getDefaultUrl(relatedHighlight) : "";
		const hasHighlight = highlightHref.trim() !== "" ? "has-highlight" : "";
		const pitcherChanged = (!oldPitcher) || (newPitcher && oldPitcher.id !== newPitcher.id);

		let pitcherChangedRendered = <div/>;
		if (pitcherChanged && newPitcher)
		{
			const changedString = oldPitcher !== null
				? `${newPitcher.name_display_first_last} relieved ${oldPitcher.name_display_first_last}`
				: `${newPitcher.name_display_first_last} pitching`;
			pitcherChangedRendered = <div className={`pitcher-changed`} key={batterIndex * 99}>
				{changedString}
			</div>;
		}

		return (
			<div className={`play-by-play-event`} key={batterIndex}>
				{pitcherChangedRendered}
				<div className={`batter ${expandedClass}`}>
					<div className={`result`}>
						<a className={`play-highlight ${hasHighlight}`} target={`_blank`} href={highlightHref}>
							<i className={`material-icons`}>play_circle_filled</i>
						</a>
						<div className={`result-trigger`} onClick={(e) => this.toggleExpandedState(e)}>
							<span className={`play-description`}>{batter.des}</span>
							<span className={`current-score`}>({batter.away_team_runs} - {batter.home_team_runs})</span>
						</div>
					</div>
					<div className={`pitches`}>
						{strikezone}
						<div className={`pitch-list`}>
							{pitches}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
