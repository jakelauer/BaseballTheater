import {LiveGamePlayCount} from "@MlbDataServer/Contracts";
import {ISinglePropWrapper} from "@Utility/Internal/InternalPropsUtility";
import React = require("react");

export class GameCount extends React.Component<ISinglePropWrapper<LiveGamePlayCount>, any>
{
	public render()
	{
		const count = this.props.data;
		const ballOn = (ballCount: number) => ballCount <= count.balls ? "on" : "";
		const strikeOn = (strikeCount: number) => strikeCount <= count.strikes ? "on" : "";
		
		return (
			<div className={`count`}>
				<div className={`balls`}>
					<div className={`ball ${ballOn(1)}`}/>
					<div className={`ball ${ballOn(2)}`}/>
					<div className={`ball ${ballOn(3)}`}/>
					<div className={`ball ${ballOn(4)}`}/>
				</div>
				<div className={`strikes`}>
					<div className={`strike ${strikeOn(1)}`}/>
					<div className={`strike ${strikeOn(2)}`}/>
					<div className={`strike ${strikeOn(3)}`}/>
				</div>
			</div>
		);
	}
}