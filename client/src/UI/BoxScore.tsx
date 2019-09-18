import * as React from "react";
import {LiveData} from "baseball-theater-engine";

interface IBoxScoreProps
{
	liveData: LiveData;
}

interface DefaultProps
{
}

type Props = IBoxScoreProps & DefaultProps;
type State = IBoxScoreState;

interface IBoxScoreState
{
}

export class BoxScore extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {};
	}

	public render()
	{
		return (
			<div />
		);
	}
}