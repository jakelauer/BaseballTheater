import {Utility} from "@Utility/index";
import {Collapse, List} from "antd";
import * as React from "react";
import {LiveGamePlay, LiveGamePlayByInning, LiveGamePlayEvent, LiveGamePlays} from "@MlbDataServer/Contracts";
import {PlayByPlayPitches} from "../play-by-play/play_by_play_pitches";

interface ILiveInningsProps
{
	plays: LiveGamePlays;
	isSpringTraining: boolean;
}

interface ILiveInningProps
{
	isSpringTraining: boolean;
	inningIndex: number;
	allPlays: LiveGamePlay[];
	playsForInning: LiveGamePlayByInning;
}

export class LiveInnings extends React.Component<ILiveInningsProps, {}>
{
	public render()
	{
		const playsByInning = this.props.plays.playsByInning;

		const innings = playsByInning.map((inning, i) =>
			<LiveInning key={i} allPlays={this.props.plays.allPlays} playsForInning={inning} inningIndex={i} isSpringTraining={this.props.isSpringTraining}/>);

		return (
			innings
		);
	}
}

class LiveInning extends React.Component<ILiveInningProps, {}>
{
	private renderPitch = (pitch: LiveGamePlayEvent, pitchIndex: number) => {
		return <List.Item>
			<div className={`pitch`} key={pitchIndex} data-type={pitch.type}>
				<div className={`pitch-count`}>{pitchIndex + 1}</div>
				<div className={`pitch-description`}>{pitch.details.call.description}</div>
				<div className={`pitch-details`}>
					{pitch.pitchData.startSpeed} MPH {pitch.type}
				</div>
			</div>
		</List.Item>;
	}
	
	private renderPlay(playIndex: number)
	{
		const play = this.props.allPlays[playIndex];
		const pitches = Utility.Mlb.getPitchDataForPlay(play);

		const pitchDescs = play.playEvents
			.filter(a => a.isPitch);

		return (
			<Collapse bordered={false}>
				<Collapse.Panel header={play.result.description} key={playIndex.toString()}>
					<PlayByPlayPitches isSpringTraining={this.props.isSpringTraining} pitches={pitches}/>
					<List dataSource={pitchDescs} renderItem={pitch => this.renderPitch(pitch, pitchDescs.indexOf(pitch))} />
				</Collapse.Panel>
			</Collapse>
		);
	}

	public render()
	{
		const bottomPlays = this.props.playsForInning.bottom.map(playIndex => this.renderPlay(playIndex));
		const topPlays = this.props.playsForInning.top.map(playIndex => this.renderPlay(playIndex));

		return (
			<div>
				<h1>Inning {this.props.inningIndex + 1}</h1>
				<h3>Top</h3>
				{topPlays}
				<h3>Bottom</h3>
				{bottomPlays}
			</div>
		);
	}
}