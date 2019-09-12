import * as React from "react";
import moment from "moment/moment";
import {MlbClientDataFetcher} from "../../Global/Mlb/MlbClientDataFetcher";
import {IScheduleGameList} from "baseball-theater-engine/dist/contract/teamschedule";
import {CircularProgress} from "@material-ui/core";

interface IGameListProps
{
	day: moment.Moment;
}

interface DefaultProps
{
}

type Props = IGameListProps & DefaultProps;
type State = IGameListState;

interface IGameListState
{
	scoreboard: IScheduleGameList;
	isCurrent: boolean;
}

export class GameList extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			scoreboard: null,
			isCurrent: false
		}
	}

	public componentDidMount()
	{
		this.fetchSchedule();
	}

	public shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean
	{
		if (!nextProps.day.isSame(this.props.day))
		{
			this.fetchSchedule();
		}

		return true;
	}

	private fetchSchedule()
	{
		MlbClientDataFetcher.getScoreboard(this.props.day)
			.then(data =>
			{
				const isCurrent = !data.dates.some(d => d.totalGamesInProgress === 0);

				this.setState({
					scoreboard: data,
					isCurrent
				});
			}, () =>
			{
				if (this.state.isCurrent)
				{
					setTimeout(() => this.fetchSchedule(), 30 * 1000);
				}
			})
	}

	public render()
	{
		if (!this.state.scoreboard)
		{
			return <CircularProgress/>;
		}
		return (
			<div>
				{this.state.scoreboard.dates.length}
			</div>
		);
	}
}