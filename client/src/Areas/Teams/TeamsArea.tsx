import * as React from "react";

interface ITeamsAreaProps
{
}

interface DefaultProps
{
}

type Props = ITeamsAreaProps & DefaultProps;
type State = ITeamsAreaState;

interface ITeamsAreaState
{
}

export default class TeamsArea extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {};
	}

	public render()
	{
		return (
			<div/>
		);
	}
}