import * as React from "react";

interface ILiveGameProps
{
}

interface DefaultProps
{
}

type Props = ILiveGameProps & DefaultProps;
type State = ILiveGameState;

interface ILiveGameState
{
}

export class LiveGame extends React.Component<Props, State>
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