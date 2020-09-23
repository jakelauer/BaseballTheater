import * as React from "react";
import {LiveGamePlay, LiveGamePlayEvent} from "baseball-theater-engine";
import styles from "./Strikezone.module.scss";
import {Tooltip, Typography} from "@material-ui/core";

interface ISizes
{
	maxY: number;
	maxX: number;
	yOffset: number;
	xOffset: number;
}

interface IStrikezoneProps
{
	play: LiveGamePlay;
}

interface DefaultProps
{
}

type Props = IStrikezoneProps & DefaultProps;
type State = IStrikezoneState;

interface IStrikezoneState
{
}

export class Strikezone extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {};
	}

	public render()
	{
		const playEvents = this.props.play.playEvents;
		const pitches = this.props.play.pitchIndex.map(index => playEvents[index]);

		return (
			<div className={styles.wrapper}>
				<div className={styles.zone}>
					<div className={styles.zoneBox}>
						{pitches.map(p => (
							<Pitch {...p} />
						))}
					</div>
				</div>
			</div>
		);
	}
}

const Pitch: React.FC<LiveGamePlayEvent> = (pitch) =>
{
	const pitchData = pitch.pitchData;
	if (!pitchData)
	{
		return null;
	}

	const bottom = pitchData.strikeZoneBottom;
	const top = pitchData.strikeZoneTop;
	const height = top - bottom;

	const leftPct = (pitchData.coordinates.pX + 0.8) / 1.8;
	const bottomPct = (pitchData.coordinates.pZ - bottom) / height;

	return (
		<Tooltip title={<PitchTooltip {...pitch}/>} enterTouchDelay={0}>
			<div className={styles.pitch} style={{
				left: `${leftPct * 100}%`,
				bottom: `${bottomPct * 100}%`,
				zIndex: pitch.pitchNumber + 1
			}} key={pitch.pitchNumber} data-type={pitch.type}>
				<span className={styles.pitchCount} style={{backgroundColor: pitch.details.ballColor}}>{pitch.pitchNumber}</span>
			</div>
		</Tooltip>
	);
};

const PitchTooltip: React.FC<LiveGamePlayEvent> = (pitch) =>
{
	const pitchData = pitch.pitchData;

	return (
		<Typography>
			<table>
				<tr>
					<td>Start Speed</td>
					<td>{pitchData.startSpeed} MPH</td>
				</tr>
				<tr>
					<td>End Speed</td>
					<td>{pitchData.endSpeed} MPH</td>
				</tr>
			</table>
		</Typography>
	);
}