import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {Sidebar} from "./Sidebar";
import {IAuthContext} from "../Global/AuthIntercom";
import styles from "./App.module.scss";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import {Menu} from "@material-ui/icons";

interface ISidebarDrawerProps
{
	authContext: IAuthContext;
}

interface DefaultProps
{
}

type Props = ISidebarDrawerProps & DefaultProps;
type State = ISidebarDrawerState;

interface ISidebarDrawerState
{
	drawerOpen: boolean;
}

export class SidebarDrawer extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			drawerOpen: false
		};
	}

	private closeDrawer = () =>
	{
		this.setState({
			drawerOpen: false
		});
	};

	private openDrawer = () =>
	{
		this.setState({
			drawerOpen: true
		});
	};

	public render()
	{
		return (
			<React.Fragment>
				<AppBar position="fixed" className={styles.appBar}>
					<Toolbar>
						<IconButton edge="start" className={styles.menuButton} color="inherit" aria-label="menu" onClick={this.openDrawer}>
							<Menu/>
						</IconButton>
					</Toolbar>
				</AppBar>
				<SwipeableDrawer
					onClose={this.closeDrawer}
					onOpen={this.openDrawer}
					open={this.state.drawerOpen}
					disableBackdropTransition={true}
				>
					<Sidebar authContext={this.props.authContext} onNavigate={this.closeDrawer}/>
				</SwipeableDrawer>
			</React.Fragment>
		);
	}
}