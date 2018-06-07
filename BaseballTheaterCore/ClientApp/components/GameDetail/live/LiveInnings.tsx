import {Utility} from "@Utility/index";
import {Button, Collapse, Icon, List, Radio} from "antd";
import * as React from "react";
import {IHighlight, IHighlightsCollection, Keyword, LiveGamePlay, LiveGamePlayByInning} from "@MlbDataServer/Contracts";
import {PlayByPlayPitches} from "../play-by-play/play_by_play_pitches";
import {RadioChangeEvent} from "antd/lib/radio";
import {LiveGameData} from "@MlbDataServer/Contracts/live";
import {HighlightUtility} from "../../shared/highlight_utility";

interface ILiveInningsProps
{
	showInnings: "all" | "current";
	data: LiveGameData;
	isSpringTraining: boolean;
	highlights: IHighlightsCollection | null;
}

interface ILiveInningsState
{
	currentInningIndex: number;
}

interface ILiveInningProps
{
	isSpringTraining: boolean;
	showInnings: "all" | "current";
	inningIndex: number;
	data: LiveGameData;
	playsForInning: LiveGamePlayByInning;
	highlights: IHighlightsCollection | null;
}

export class LiveInnings extends React.Component<ILiveInningsProps, ILiveInningsState>
{
	constructor(props: ILiveInningsProps)
	{
		super(props);

		const currentInningIndex = props.data.plays && props.data.plays.playsByInning
			? props.data.plays.playsByInning.length - 1
			: 0;

		this.state = {
			currentInningIndex
		};
	}

	private onSelectInning(e: RadioChangeEvent)
	{
		this.setState({
			currentInningIndex: Number(e.target.value)
		});
	}

	public render()
	{
		const playsByInning = this.props.data.plays.playsByInning;

		const currentInning = playsByInning[this.state.currentInningIndex];

		const inningSelectors = playsByInning.map((innings, i) => <Radio.Button key={i} value={i}>{i + 1}</Radio.Button>);

		return (
			<React.Fragment>
				{this.props.showInnings === "all" &&
				<Radio.Group onChange={e => this.onSelectInning(e)} value={this.state.currentInningIndex}>
					{inningSelectors}
				</Radio.Group>
				}
				<LiveInning
					highlights={this.props.highlights}
					showInnings={this.props.showInnings}
					data={this.props.data}
					playsForInning={currentInning}
					inningIndex={this.state.currentInningIndex}
					isSpringTraining={this.props.isSpringTraining}/>
			</React.Fragment>
		);
	}
}

class LiveInning extends React.Component<ILiveInningProps, {}>
{
	private getHighlightForPlay(play: LiveGamePlay): IHighlight | null
	{
		const svIds = play.playEvents.map(a => a.playId);

		const hc = this.props.highlights;
		let foundHighlight: IHighlight | null = null;
		if (hc && hc.highlights && hc.highlights.media)
		{
			const highlights = hc.highlights.media instanceof Array
				? hc.highlights.media
				: [(hc.highlights.media as any) as IHighlight];

			const matching = highlights.find(highlight => {
				let found = false;
				if (highlight.keywords && highlight.keywords.keyword)
				{
					const keywords = highlight.keywords.keyword instanceof Array
						? highlight.keywords.keyword
						: ([highlight.keywords.keyword] as any) as Keyword[];

					keywords.forEach(keyword => {
						found = found || (keyword.type === "sv_id" && (svIds.indexOf(keyword.value) > -1));
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

	private renderPlay(playIndex: number)
	{
		const play = this.props.data.plays.allPlays[playIndex];
		const pitches = Utility.Mlb.getPitchDataForPlay(play);

		const pitchDescs = play.playEvents
			.filter(a => a.isPitch);

		const matchingHighlight = this.getHighlightForPlay(play);
		const highlightHref = matchingHighlight && HighlightUtility.getDefaultUrl(matchingHighlight);
		const highlightClickable = matchingHighlight
			? <Button type="primary" shape="circle"  href={highlightHref} htmlType={"a"} size={"small"} style={{marginRight: "0.5rem"}} target="_blank" onClick={e => { e.stopPropagation(); }}>
				<Icon type="caret-right" />
			</Button>
			: null;

		let headerText: React.ReactNode = play.result.description || `${play.matchup.batter.fullName} batting against ${play.matchup.pitcher.fullName}`;
		if (play.about.isScoringPlay)
		{
			headerText = <strong>{headerText}</strong>;
		}

		const header = <React.Fragment>
			{highlightClickable}
			{headerText}
		</React.Fragment>;

		if (!play.result.description && this.props.showInnings === "all")
		{
			return null;
		}
		
		const activeKey = !play.about.isComplete ? playIndex.toString() : "";

		return (
			<Collapse bordered={false} key={playIndex} defaultActiveKey={[activeKey]}>
				<Collapse.Panel header={header} key={playIndex.toString()} showArrow={!!play.result.description}>
					<PlayByPlayPitches isSpringTraining={this.props.isSpringTraining} pitches={pitches}/>
					<List dataSource={pitchDescs} renderItem={pitch => Utility.Mlb.renderPitch(pitch, pitchDescs.indexOf(pitch))}/>
				</Collapse.Panel>
			</Collapse>
		);
	}

	public render()
	{
		let bottomPlayIndices = this.props.playsForInning.bottom;
		let topPlayIndices = this.props.playsForInning.top;

		if (this.props.showInnings === "current")
		{
			bottomPlayIndices = [...bottomPlayIndices].reverse();
			topPlayIndices = [...topPlayIndices].reverse();
		}

		const bottomPlays = bottomPlayIndices.map(playIndex => this.renderPlay(playIndex));
		const topPlays = topPlayIndices.map(playIndex => this.renderPlay(playIndex));

		const topRendered = <React.Fragment>
			<h3 style={{marginTop: "2rem"}}>Top {this.props.inningIndex + 1}</h3>
			{topPlays}
		</React.Fragment>;

		const bottomRendered = <React.Fragment>
			<h3 style={{marginTop: "2rem"}}>Bottom {this.props.inningIndex + 1}</h3>
			{bottomPlays}
		</React.Fragment>;

		let rendered = [topRendered, bottomRendered];
		if (this.props.showInnings === "current")
		{
			const isTop = this.props.data.linescore.isTopInning;
			rendered = [isTop ? topRendered : bottomRendered];
		}

		return (
			rendered
		);
	}
}