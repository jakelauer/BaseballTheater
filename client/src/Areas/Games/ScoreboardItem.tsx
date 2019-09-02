import * as React from "react";
import {IGameSummaryData} from "../../../../contract";

interface IScoreboardItemProps
{
	game: IGameSummaryData;
}

interface DefaultProps
{
}

type Props = IScoreboardItemProps & DefaultProps;

interface IScoreboardItemState
{
}

export class ScoreboardItem extends React.Component<Props, IScoreboardItemState>
{
	constructor(props: Props)
	{
		super(props);
	}

	public render()
	{
		return (
			<div>
				{this.props.game.away_team_name} // {this.props.game.home_team_name}
			</div>
		);
	}
}