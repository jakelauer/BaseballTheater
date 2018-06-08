import * as React from "react";
import {Icon} from "antd";
import {LiveData} from "@MlbDataServer/Contracts";


interface IGameFieldStatusProps
{
	game: LiveData;
}

export class GameFieldStatus extends React.Component<IGameFieldStatusProps, {}>
{
	private get linescore()
	{
		return this.props.game.liveData.linescore;
	}

	public render()
	{
		const {
			offense,
			outs,
			balls,
			strikes,
			isTopInning,
			currentInning
		} = this.linescore;

		const onFirst = offense.first !== undefined && "on";
		const onSecond = offense.second !== undefined && "on";
		const onThird = offense.third !== undefined && "on";

		const topInningOn = isTopInning ? "on" : "";
		const bottomInningOn = !isTopInning ? "on" : "";

		return (
			<div className={`game-field-status`}>
				<div className={`inning-status`}>
					<div className={`inning-arrow top ${topInningOn}`}>
						<Icon type="caret-up" />
					</div>
					<div className={`inning`}>{currentInning}</div>
					<div className={`inning-arrow bottom ${bottomInningOn}`}>
						<Icon type="caret-down" />
					</div>
				</div>
				<div className={`field`}>
					<div className={`field-base base-third ${onThird}`}/>
					<div className={`field-base base-second ${onSecond}`}/>
					<div className={`field-base base-first ${onFirst}`}/>
				</div>
				<div className={`dots`}>
					<div className={`dot-container balls`}>
						<span>B </span>
						<div className={`dot-item ball ${balls > 0 && "on"}`}/>
						<div className={`dot-item ball ${balls > 1 && "on"}`}/>
						<div className={`dot-item ball ${balls > 2 && "on"}`}/>
						<div className={`dot-item ball ${balls > 3 && "on"}`}/>
					</div>
					<div className={`dot-container strikes`}>
						<span>S </span>
						<div className={`dot-item strike ${strikes > 0 && "on"}`}/>
						<div className={`dot-item strike ${strikes > 1 && "on"}`}/>
						<div className={`dot-item strike ${strikes > 2 && "on"}`}/>
					</div>
					<div className={`dot-container outs`}>
						<span>O </span>
						<div className={`dot-item out ${outs > 0 && "on"}`}/>
						<div className={`dot-item out ${outs > 1 && "on"}`}/>
						<div className={`dot-item out ${outs > 2 && "on"}`}/>
					</div>
				</div>
			</div>
		);
	}
}