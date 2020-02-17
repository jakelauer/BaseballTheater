import * as React from "react";
import {StandingsPage} from "./StandingsPage";

interface IStandingsAreaProps
{
}

interface DefaultProps
{
}

type Props = IStandingsAreaProps & DefaultProps;
type State = IStandingsAreaState;

interface IStandingsAreaState
{
}

export default class StandingsArea extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {};
	}

	public render()
	{
		return (
			<StandingsPage/>
		);
	}
}