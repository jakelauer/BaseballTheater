import React = require("react");
import {PlayerWithStats} from "../../../MlbDataServer/Contracts";
import {ISinglePropWrapper} from "../../../Utility/SharedProps";

export class PlayerStatsCard extends React.Component<ISinglePropWrapper<PlayerWithStats | null>, any>
{
	public render()
	{
		const player = this.props.data;
		if (!player)
		{
			return null;
		}
		
		return (
			<div className={`player-card`}>
				{player.primaryPosition.abbreviation} {player.firstLastName}
			</div>
		);
	}
}