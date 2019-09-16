import * as React from "react";

interface IWrapProps
{
}

interface DefaultProps
{
}

type Props = IWrapProps & DefaultProps;
type State = IWrapState;

interface IWrapState
{
}

export class Wrap extends React.Component<Props, State>
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