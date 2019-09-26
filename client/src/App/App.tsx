import React from 'react';
import styles from "./App.module.scss";
import {Button, DialogContentText, Grid} from "@material-ui/core";
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
import {AuthIntercom, IAuthContext} from "../Global/AuthIntercom";
import cookies from "browser-cookies";

interface IAppState
{
	drawerOpen: boolean;
	search: string;
	loading: boolean;
	error: Error;
	authContext: IAuthContext;
}

export class App extends React.Component<{}, IAppState>
{
	constructor(props: {})
	{
		super(props);

		this.state = {
			drawerOpen: false,
			error: undefined,
			search: "",
			loading: false,
			authContext: AuthIntercom.current
		};
	}

	private get patreonUrl()
	{
		const clientId = "4f3fb1d9df8f53406f60617258e66ef5cba993b1aa72d2e32e66a1b5be0b9008";
		const redirectUri = `${window.location.protocol}//${window.location.hostname}:5000/auth/redirect`;
		return `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
	}

	public componentDidMount(): void
	{
		AuthIntercom.listen(data => this.setState({
			authContext: data
		}));
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

	private logOut = () =>
	{
		cookies.erase("id");
		cookies.erase("token");
		cookies.erase("token_expiry");

		AuthIntercom.refresh();
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
				{!this.state.authContext.authorized &&
                <Button component={p => <a {...p} href={this.patreonUrl}/>}>
                    Log in with Patreon
                </Button>
				}
				{this.state.authContext.authorized &&
                <Button color={"primary"} onClick={this.logOut}>
                    Log out
                </Button>
				}
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