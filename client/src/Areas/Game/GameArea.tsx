import * as React from "react";
import styles from "./GameArea.module.scss";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {LibraryBooks, ListAlt, PlayCircleOutline, Update} from "@material-ui/icons";
import {RouteComponentProps} from "react-router";
import {IGameParams} from "../../Global/Routes/Routes";
import {Wrap} from "./Wrap";
import {LiveGame} from "./LiveGame";
import {BoxScore} from "./BoxScore";
import {Highlights} from "./Highlights";

interface IGameAreaProps extends RouteComponentProps<IGameParams>
{
}

interface DefaultProps
{
}

type Props = IGameAreaProps & DefaultProps;
type State = IGameAreaState;

interface IGameAreaState
{
	tabValue: string;
}

export class GameArea extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			tabValue: props.match.params.tab
		};
	}

	private handleChange = (e: React.ChangeEvent<{}>, value: string) =>
	{
		this.setState({
			tabValue: value
		})
	};

	private renderTab()
	{
		switch (this.props.match.params.tab)
		{
			case "Wrap":
				return <Wrap/>;
			case "LiveGame":
				return <LiveGame/>;
			case "BoxScore":
				return <BoxScore/>;
			case "Highlights":
				return <Highlights gamePk={this.props.match.params.gameId}/>;
		}
	}

	public render()
	{
		return (
			<div className={styles.gameWrapper}>
				<div className={styles.content}>
					{this.renderTab()}
				</div>
				<BottomNavigation
					value={this.state.tabValue}
					onChange={this.handleChange}
					showLabels
					className={styles.root}
				>
					<BottomNavigationAction label="Wrap" icon={<LibraryBooks/>} value={"Wrap"}/>
					<BottomNavigationAction label="Live Game" icon={<Update/>} value={"LiveGame"}/>
					<BottomNavigationAction label="Box Score" icon={<ListAlt/>} value={"BoxScore"}/>
					<BottomNavigationAction label="Highlights" icon={<PlayCircleOutline/>} value={"Highlights"}/>
				</BottomNavigation>
			</div>
		);
	}
}