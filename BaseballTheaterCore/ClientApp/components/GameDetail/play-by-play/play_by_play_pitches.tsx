import * as React from "react";
import {IPitch} from "../../../MlbDataServer/Contracts";

interface ISizes
{
	maxY: number;
	maxX: number;
	yOffset: number;
	xOffset: number;
}

interface IPlayByPlayPitchesProps
{
	isSpringTraining: boolean;
	pitches: IPitch[];
}

export class PlayByPlayPitches extends React.Component<IPlayByPlayPitchesProps, any>
{
	public render()
	{
		const regularSeason: ISizes = {
			maxX: 300,
			maxY: 165,
			yOffset: -0.55,
			xOffset: -0.10
		};

		const springTraining: ISizes = {
			maxX: 300,
			maxY: 300,
			yOffset: 0,
			xOffset: -0.13
		};

		const pitchesRendered = this.props.pitches.map((pitch, i) =>
		{
			const sizes = this.props.isSpringTraining
				? springTraining
				: regularSeason;

			const pitchX = parseFloat(pitch.x);
			const pitchY = parseFloat(pitch.y);

			const leftPct = 1 - (pitchX / sizes.maxX) + sizes.xOffset;
			const topPct = (pitchY / sizes.maxY) + sizes.yOffset;

			const style = {
				left: `${leftPct * 100}%`,
				top: `${topPct * 100}%`,
				zIndex: i + 1
			}

			return (
				<div className={`pitch`} style={style} key={i} data-type={pitch.type}>
					<span className={`pitch-count`}>{i + 1}</span>
				</div>
			);
		});

		return (
			<div className={`strikezone`}>
				<div className={`force-square`}></div>
				{pitchesRendered}
				<div className={`actual-strikezone`}></div>
			</div>
		);
	}
}
