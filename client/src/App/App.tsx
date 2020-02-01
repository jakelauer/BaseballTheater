import React from 'react';
import styles from "./App.module.scss";
import {DialogContentText, Grid} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import {Menu} from "@material-ui/icons";
import Drawer from "@material-ui/core/Drawer";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import {AuthIntercom, IAuthContext} from "../Global/AuthIntercom";
import {Routes} from "./Routes";
import {Sidebar} from "./Sidebar";
import ScrollMemory from "react-router-scroll-memory";
import {RespondSizes} from "../Global/Respond/RespondIntercom";
import {Respond} from "../Global/Respond/Respond";

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
			authContext: AuthIntercom.state
		};
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

	public render()
	{
		return (
			<React.Fragment>
				<ScrollMemory />
				<div className={styles.wrapper}>
					<nav className={styles.nav}>
						<Respond at={RespondSizes.medium}>
							<AppBar position="fixed" className={styles.appBar}>
								<Toolbar>
									<IconButton edge="start" className={styles.menuButton} color="inherit" aria-label="menu" onClick={this.openDrawer}>
										<Menu/>
									</IconButton>
								</Toolbar>
							</AppBar>
							<SwipeableDrawer onClose={this.closeDrawer} onOpen={this.openDrawer} open={this.state.drawerOpen}>
								<Sidebar authContext={this.state.authContext} onNavigate={this.closeDrawer}/>
							</SwipeableDrawer>
						</Respond>
						<Respond at={RespondSizes.medium} hide={true}>
							<Drawer anchor={"left"} variant={"persistent"} open={true} classes={{
								paper: styles.drawerPaper
							}}>
								<Sidebar authContext={this.state.authContext}/>
							</Drawer>
						</Respond>
					</nav>
					<main className={styles.main}>
						<Container maxWidth={"xl"} style={{position: "relative", paddingLeft: 0}}>
							<Grid container>
								<Routes/>
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
			</React.Fragment>
		);
	}
}

export default App;