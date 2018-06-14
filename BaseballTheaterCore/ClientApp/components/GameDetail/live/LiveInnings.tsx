import {Utility} from "@Utility/index";
import {Button, Collapse, Icon, List, Radio} from "antd";
import * as React from "react";
import {IHighlight, IHighlightsCollection, Keyword, LiveData, LiveGamePlay, LiveGamePlayByInning} from "@MlbDataServer/Contracts";
import {PlayByPlayPitches} from "../play-by-play/play_by_play_pitches";
import {RadioChangeEvent} from "antd/lib/radio";
import {HighlightUtility} from "../../shared/highlight_utility";
import {Link} from "react-router-dom";

interface ILiveInningsProps
{
	showInnings: "all" | "current";
	game: LiveData;
	isSpringTraining: boolean;
	highlights: IHighlightsCollection | null;
}

interface ILiveInningsState
{
	currentInningIndex: number;
}

interface ILiveInningProps extends ILiveInningsProps
{
	inningIndex: number;
	playsForInning: LiveGamePlayByInning;
}

interface ILiveInningState
{
	currentPlayIndex: string;
	openInnings: string[];
}

export class LiveInnings extends React.Component<ILiveInningsProps, ILiveInningsState>
{
	private getCurrentInningIndex(props: ILiveInningsProps)
	{
		return props.game.liveData.plays && props.game.liveData.plays.playsByInning
			? props.game.liveData.plays.playsByInning.length - 1
			: 0;
	}

	constructor(props: ILiveInningsProps)
	{
		super(props);

		this.state = {
			currentInningIndex: this.getCurrentInningIndex(props)
		};
	}

	private onSelectInning(e: RadioChangeEvent)
	{
		this.setState({
			currentInningIndex: Number(e.target.value)
		});
	}

	public componentDidMount()
	{
		this.setCurrentInning(this.props);
	}

	private setCurrentInning(props: ILiveInningsProps)
	{
		this.setState({
			currentInningIndex: this.getCurrentInningIndex(props)
		});
	}

	public componentWillReceiveProps(nextProps: ILiveInningsProps)
	{
		if (nextProps.showInnings === "current")
		{
			this.setCurrentInning(nextProps);
		}
	}

	public render()
	{
		const playsByInning = this.props.game.liveData.plays.playsByInning;

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
					game={this.props.game}
					playsForInning={currentInning}
					inningIndex={this.state.currentInningIndex}
					isSpringTraining={this.props.isSpringTraining}/>
			</React.Fragment>
		);
	}
}

class LiveInning extends React.Component<ILiveInningProps, ILiveInningState>
{
	constructor(props: ILiveInningProps)
	{
		super(props);

		let currentPlay = "0";
		if (props.game.liveData
			&& props.game.liveData.plays
			&& props.game.liveData.plays.currentPlay
			&& props.game.liveData.plays.currentPlay.about)
		{
			currentPlay = String(props.game.liveData.plays.currentPlay.about.atBatIndex);
		}

		let openInnings = [];
		if (this.props.showInnings === "current")
		{
			openInnings = [currentPlay];
		}

		this.state = {
			currentPlayIndex: currentPlay,
			openInnings
		};
	}

	public componentWillReceiveProps(nextProps: ILiveInningProps)
	{
		const existingCurrentPlay = this.state.currentPlayIndex;
		let newInnings = [...this.state.openInnings];

		if (nextProps.game.liveData
			&& nextProps.game.liveData.plays
			&& nextProps.game.liveData.plays.currentPlay
			&& nextProps.game.liveData.plays.currentPlay.about)
		{
			const newCurrentPlay = String(nextProps.game.liveData.plays.currentPlay.about.atBatIndex);
			if (existingCurrentPlay !== newCurrentPlay && newInnings.indexOf(existingCurrentPlay) > -1)
			{
				newInnings.splice(newInnings.indexOf(existingCurrentPlay), 1);
				newInnings.push(newCurrentPlay);
			}
		}

		this.setState({
			openInnings: newInnings
		});
	}

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

	private updateCollapseForPlay(key: string[], playIndex: number)
	{
		const playIndexString = String(playIndex);
		const isOpen = key.indexOf(playIndexString) > -1;
		let newInnings = [...this.state.openInnings];

		if (isOpen)
		{
			newInnings.push(playIndexString);
		}
		else
		{
			newInnings.splice(newInnings.indexOf(playIndexString), 1);
		}

		this.setState({
			openInnings: newInnings
		});
	}

	private renderPlay(playIndex: number)
	{
		const play = this.props.game.liveData.plays.allPlays[playIndex];
		const pitches = Utility.Mlb.getPitchDataForPlay(play);

		const pitchDescs = [...play.playEvents]
			.reverse();

		const matchingHighlight = this.getHighlightForPlay(play);
		const highlightHref = matchingHighlight && HighlightUtility.getDefaultUrl(matchingHighlight);
		const highlightClickable = matchingHighlight
			? <a href={highlightHref} target="_blank" onClick={e => e.stopPropagation()}>
				<Button type="primary" shape="circle" size={"small"} style={{marginRight: "0.5rem"}}>
					<Icon type="caret-right"/>
				</Button>
			</a>
			: null;


		const batterLink = Utility.Mlb.renderPlayerLink(play.matchup.batter);
		const pitcherLink = Utility.Mlb.renderPlayerLink(play.matchup.pitcher);
		let headerText: React.ReactNode = play.result.description || <span>{batterLink} batting against {pitcherLink}</span>;

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

		//const activeKey = !play.about.isComplete ? playIndex.toString() : null;

		const gameIsFinal = Utility.Mlb.gameIsFinal(this.props.game.gameData.status.statusCode);
		const playIndexString = String(playIndex);
		const activeKey = this.state.openInnings.indexOf(playIndexString) > -1
			? playIndexString
			: null;
		const activeArray = [activeKey];

		return (
			<Collapse bordered={false} key={playIndex} activeKey={activeArray} onChange={(key: string[]) => this.updateCollapseForPlay(key, playIndex)}>
				<Collapse.Panel header={header} key={playIndex.toString()} showArrow={!!play.result.description} forceRender={true}>
					<div className={`pitch-data-wrapper`}>
						<PlayByPlayPitches isSpringTraining={this.props.isSpringTraining} pitches={pitches}/>
						<List dataSource={pitchDescs} renderItem={pitch => Utility.Mlb.renderPitch(pitch)}/>
					</div>
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

		let topRendered = <React.Fragment key={0}>
			<h3>Top {this.props.inningIndex + 1}</h3>
			{topPlays}
		</React.Fragment>;

		if (!topPlays || topPlays.length === 0)
		{
			topRendered = null;
		}

		let bottomRendered = <React.Fragment key={1}>
			<h3>Bottom {this.props.inningIndex + 1}</h3>
			{bottomPlays}
		</React.Fragment>;

		if (!bottomPlays || bottomPlays.length === 0)
		{
			bottomRendered = null;
		}

		let rendered = [topRendered, bottomRendered];
		if (this.props.showInnings === "current")
		{
			const isTop = this.props.game.liveData.linescore.isTopInning;
			rendered = [isTop ? topRendered : bottomRendered];
		}

		return (
			<div className={`live-innings`}>
				{rendered}
			</div>
		);
	}
}