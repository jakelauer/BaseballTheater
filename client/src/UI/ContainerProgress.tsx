import * as React from "react";
import {CircularProgress} from "@material-ui/core";

interface IContainerProgressProps
{
}

interface DefaultProps
{
}

type Props = IContainerProgressProps & DefaultProps;
type State = IContainerProgressState;

interface IContainerProgressState
{
}

export class ContainerProgress extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {};
	}

	public render()
	{
		return (
			<div style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			}}>
				<CircularProgress/>
			</div>
		);
	}
}