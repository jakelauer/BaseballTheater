import * as React from "react";
import moment from "moment/moment";
import {RouteComponentProps, withRouter} from "react-router";
import {GameList} from "./GameList";

interface IGamesAreaParams
{
	yyyymmdd: string;
}

interface IGamesAreaState
{
}

class GamesArea extends React.Component<RouteComponentProps<IGamesAreaParams>, IGamesAreaState>
{
	constructor(props: RouteComponentProps<IGamesAreaParams>)
	{
		super(props);

		this.state = {
		};
	}

	public render()
	{
		const date = moment(this.props.match.params.yyyymmdd);
		return (
			<GameList day={date}/>
		);
	}
}

export default withRouter(GamesArea);