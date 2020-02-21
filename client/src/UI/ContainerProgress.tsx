import * as React from "react";
import {CircularProgress} from "@material-ui/core";
import {RespondDataStore, RespondDataStorePayload, RespondSizes} from "../Global/Respond/RespondDataStore";

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
	respond: RespondDataStorePayload;
}

export class ContainerProgress extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			respond: RespondDataStore.state
		};
	}

	public componentDidMount(): void
	{
		RespondDataStore.listen(data =>
		{
			this.setState({
				respond: data
			});
		});
	}

	public render()
	{
		return (
			<div style={{
				position: "fixed",
				zIndex: 99,
				top: 0,
				left: RespondDataStore.test(RespondSizes.medium) ? 0 : "15vw",
				right: 0,
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				pointerEvents: "none"
			}}>
				<CircularProgress/>
			</div>
		);
	}
}