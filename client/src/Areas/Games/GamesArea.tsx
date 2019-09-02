import * as React from "react";
import {StatefulDatepicker} from "baseui/datepicker";
import moment from "moment/moment";
import {ScoreboardItem} from "./ScoreboardItem";
import {IGameSummaryCollection} from "../../../../contract";
import {GameSummaryCreator} from "../../../../engine/MlbDataServer";

interface IGamesAreaProps
{
}

interface DefaultProps
{
}

type Props = IGamesAreaProps & DefaultProps;

interface IGamesAreaState
{
	games: IGameSummaryCollection;
}

export class GamesArea extends React.Component<Props, IGamesAreaState>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			games: null
		};
	}

	public componentDidMount(): void
	{
		const now = moment();
		GameSummaryCreator.getSummaryCollection(now)
			.then(data => this.setState({
				games: data
			}));
	}

	public render()
	{
		const games = this.state.games ? this.state.games.games.game : [];
		const scoreboardItems = games.map(game => <ScoreboardItem game={game}/>);

		return (
			<div>
				<StatefulDatepicker/>
				{scoreboardItems}
			</div>
		);
	}
}