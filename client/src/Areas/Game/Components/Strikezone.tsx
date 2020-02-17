import * as React from "react";
import {LiveGamePlay} from "baseball-theater-engine";
import styles from "./Strikezone.module.scss";

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
		const play = this.props.play;
		const playEvents = this.props.play.playEvents;
		const pitches = this.props.play.pitchIndex.map(index => playEvents[index]);

		const pitchesRendered = pitches.map((pitch, i) =>
		{
			const pitchData = pitch.pitchData;
			if (!pitchData)
			{
				return null;
			}

			const bottom = 1.6;
			const top = 3.5;
			const height = top - bottom;

			const leftPct = (pitchData.coordinates.pX + 0.95) / 1.9;
			const bottomPct = (pitchData.coordinates.pZ - bottom) / height;

			const style = {
				left: `${leftPct * 100}%`,
				bottom: `${bottomPct * 100}%`,
				zIndex: i + 1
			};

			return (
				<div className={styles.pitch} style={style} key={i} data-type={pitch.type}>
					<span className={styles.pitchCount} style={{backgroundColor: pitch.details.ballColor}}>{i + 1}</span>
				</div>
			);
		});

		return (
			<div className={styles.wrapper}>
				<div className={styles.zone}>
					<div className={styles.zoneBox}>
						{pitchesRendered}
					</div>
				</div>
			</div>
		);
	}
}