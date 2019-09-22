import React from 'react';
import styles from "./App.module.scss";
import {DialogContentText, Grid} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import SportsBaseball from '@material-ui/icons/SportsBaseball';
import {Equalizer, Menu, People, PlayCircleFilled} from "@material-ui/icons";
import EventIcon from "@material-ui/icons/Event";
import Drawer from "@material-ui/core/Drawer";
import {Respond, RespondSizes} from "../Global/Respond/Respond";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import {Link, Redirect, Route, Switch} from "react-router-dom";
import {SiteRoutes} from "../Global/Routes/Routes";
import GamesArea from "../Areas/Games/GamesArea";
import {GameArea} from "../Areas/Game/GameArea";
import {ApiTestArea} from "../Areas/ApiTest/ApiTestArea";

interface IAppState
{
	drawerOpen: boolean;
	search: string;
	loading: boolean;
	error: Error;
}

export class App extends React.Component<{}, IAppState>
{
	private apiTimeout: number = null;

	constructor(props: {})
	{
		super(props);

		this.state = {
			drawerOpen: false,
			error: undefined,
			search: "",
			loading: false
		};
	}

	componentDidMount()
	{
	}

	public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void
	{
		this.setState({
			error
		})
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
		const drawerContents = (
			<React.Fragment>
				<div className={styles.logo}>
					Baseball Theater
				</div>
				<List component={"nav"}>
					<MenuItem icon={<SportsBaseball/>} path={SiteRoutes.Games.resolve()}>
						Games
					</MenuItem>
					<MenuItem icon={<PlayCircleFilled/>} path={SiteRoutes.FeaturedVideos.resolve()}>
						Featured Videos
					</MenuItem>
					<MenuItem icon={<Equalizer/>} path={SiteRoutes.Standings.resolve()}>
						Standings
					</MenuItem>
					<MenuItem icon={<EventIcon/>} path={SiteRoutes.Schedule.resolve()}>
						Schedule
					</MenuItem>
					<MenuItem icon={<People/>} path={SiteRoutes.Teams.resolve()}>
						Teams
					</MenuItem>
				</List>
			</React.Fragment>
		);

		return (
			<div className={styles.wrapper}>
				<nav className={styles.nav}>
					<Respond at={RespondSizes.small}>
						<AppBar position="fixed" className={styles.appBar}>
							<Toolbar>
								<IconButton edge="start" className={styles.menuButton} color="inherit" aria-label="menu" onClick={this.openDrawer}>
									<Menu/>
								</IconButton>
							</Toolbar>
						</AppBar>
						<SwipeableDrawer onClose={this.closeDrawer} onOpen={this.openDrawer} open={this.state.drawerOpen}>
							{drawerContents}
						</SwipeableDrawer>
					</Respond>
					<Respond at={RespondSizes.small} hide={true}>
						<Drawer anchor={"left"} variant={"persistent"} open={true} classes={{
							paper: styles.drawerPaper
						}}>
							{drawerContents}
						</Drawer>
					</Respond>
				</nav>
				<main className={styles.main}>
					<Container maxWidth={"xl"}>
						<Grid container>
							<Switch>
								<Route path={SiteRoutes.ApiTest.path} component={ApiTestArea}/>
								<Route path={SiteRoutes.Games.path} component={GamesArea}/>
								<Route path={SiteRoutes.Game.path} component={GameArea}/>
								<Route exact path={"/"}>
									<Redirect to={SiteRoutes.Games.resolve()}/>
								</Route>
							</Switch>
						</Grid>
					</Container>
				</main>
				<Dialog open={this.state.error !== undefined} onClose={() => this.setState({error: undefined})}>
					<DialogTitle>Error</DialogTitle>
					<DialogContent>
						<DialogContentText>
							There was an error rendering the page :(
						</DialogContentText>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
}

export default App;

const MenuItem = (props: { icon: React.ReactElement; path: string; children?: React.ReactNode }) =>
{
	return (
		<ListItem button color={"primary"} component={p => <Link {...p} to={props.path}/>}>
			<ListItemIcon>
				{props.icon}
			</ListItemIcon>
			<ListItemText>
				{props.children}
			</ListItemText>
		</ListItem>
	);
};