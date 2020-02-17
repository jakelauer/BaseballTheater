import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {IAuthContext} from "../Global/AuthIntercom";
import styles from "./App.module.scss";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import {ArrowBack, Menu} from "@material-ui/icons";
import {FaSearch} from "react-icons/all";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {SiteRoutes} from "../Global/Routes/Routes";
import Sidebar from "./Sidebar";

interface ISidebarDrawerProps extends RouteComponentProps
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

class SidebarDrawer extends React.Component<Props, State>
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
		const menuButton = (
			<IconButton edge="start" className={styles.menuButton} color="inherit" aria-label="back" onClick={this.openDrawer}>
				<Menu style={{fontSize: "2rem"}}/> <span className={styles.logoText}>Baseball Theater</span>
			</IconButton>
		);

		const backButton = (
			<IconButton edge="start" className={styles.menuButton} color="inherit" aria-label="menu" component={p => <Link {...p} to={SiteRoutes.Games.resolve()}/>}>
				<ArrowBack style={{fontSize: "2rem"}}/> <span className={styles.logoText}>Baseball Theater</span>
			</IconButton>
		);

		const menuOrBack = (this.props.location.pathname.includes("games"))
			? menuButton
			: backButton;

		return (
			<React.Fragment>
				<AppBar position="fixed" className={styles.appBar}>
					<Toolbar className={styles.toolbar}>
						{menuOrBack}
						<div className={styles.barlogo}>
							<Link to={SiteRoutes.Search.resolve()}>
								<FaSearch style={{color: "white"}}/>
							</Link>
						</div>
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

export default withRouter(SidebarDrawer);