import * as React from "react";

interface IBoxScoreProps
{
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
	}

	public render()
	{
		return (
			<div/>
		);
	}
}