import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {IAuthContext} from "../Global/AuthDataStore";
import styles from "./App.module.scss";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import {FaSearch} from "react-icons/all";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {SiteRoutes} from "../Global/Routes/Routes";
import Sidebar from "./Sidebar";
import {HamburgerArrow} from "react-animated-burgers";
import {ServiceWorkerUpdate} from "../Global/ServiceWorkerUpdate";
import classNames from "classnames";

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
	waitingForUpdate: boolean;
}

class SidebarDrawer extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			drawerOpen: false,
			waitingForUpdate: false
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

	public componentDidMount(): void
	{
		this.checkUpdates();
	}

	private checkUpdates()
	{
		ServiceWorkerUpdate.checkForUpdates((hasUpdate) =>
		{
			this.setState({
				waitingForUpdate: hasUpdate
			})
		});
	}

	public render()
	{
		const hamburgerActive = !(this.props.location.pathname.includes("games"));
		const onClick = hamburgerActive
			? () => this.props.history.push("/")
			: this.openDrawer;

		const menuButtonClasses = classNames(styles.menuButton, {
			[styles.hasUpdate]: this.state.waitingForUpdate && !hamburgerActive
		});

		return (
			<React.Fragment>
				<AppBar position="fixed" className={styles.appBar}>
					<Toolbar className={styles.toolbar}>
						<IconButton edge="start" className={menuButtonClasses} color="inherit" aria-label="back">
							<HamburgerArrow isActive={hamburgerActive} barColor="white" buttonWidth={30} buttonStyle={{padding: 4, outline: "none"}} onClick={onClick}/>
						</IconButton>
						<span className={styles.logoText}>Baseball Theater</span>
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