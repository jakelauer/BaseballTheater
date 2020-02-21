import React, {ReactNode} from 'react';
import styles from "./App.module.scss";
import {DialogContentText, Grid} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Drawer from "@material-ui/core/Drawer";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {AuthDataStore, IAuthContext} from "../Global/AuthDataStore";
import {Routes} from "./Routes";
import Sidebar from "./Sidebar";
import ScrollMemory from "react-router-scroll-memory";
import {RespondSizes} from "../Global/Respond/RespondDataStore";
import {Respond} from "../Global/Respond/Respond";
import {ErrorBoundary} from "./ErrorBoundary";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Helmet from "react-helmet";
import moment from "moment";
import SidebarDrawer from "./SidebarDrawer";
import {RouteComponentProps, withRouter} from "react-router";
import ReactGA from "react-ga";

interface IAppState
{
	search: string;
	loading: boolean;
	authContext: IAuthContext;
	showInstallPromptDialog: boolean;
	installPromptSnackbarContent: ReactNode;
}

export class App extends React.Component<RouteComponentProps, IAppState>
{
	private beforeInstallPromptEvent: BeforeInstallPromptEvent;

	constructor(props: RouteComponentProps)
	{
		super(props);

		this.state = {
			search: "",
			loading: false,
			authContext: AuthDataStore.state,
			showInstallPromptDialog: false,
			installPromptSnackbarContent: null
		};
	}

	public componentDidMount(): void
	{
		AuthDataStore.listen(data => this.setState({
			authContext: data
		}));

		window.addEventListener("beforeinstallprompt", e =>
		{
			e.preventDefault();

			this.beforeInstallPromptEvent = e as BeforeInstallPromptEvent;

			const visits = JSON.parse(localStorage.getItem("visits") ?? "0");
			const threeMosAgo = moment().add(-3, "months");
			const declineDate = moment(localStorage.getItem("decline-date") ?? threeMosAgo.add(-1, "minute").format());

			const expired = declineDate.isBefore(threeMosAgo);

			if (visits > 3 && expired)
			{
				this.setState({
					showInstallPromptDialog: true
				});
			}
		});

		if (!location.hostname.includes("local"))
		{
			this.props.history.listen(() =>
			{
				ReactGA.pageview(window.location.pathname + window.location.search);
			});
		}
	}

	private onInstallDialogClose = () =>
	{
		this.setState({
			showInstallPromptDialog: false
		});

		localStorage.setItem("decline-date", moment().format());
	};

	private onInstallDialogApprove = () =>
	{
		this.onInstallDialogClose();
		this.beforeInstallPromptEvent?.prompt();

		// Wait for the user to respond to the prompt
		this.beforeInstallPromptEvent?.userChoice?.then((choiceResult) =>
		{
			if (choiceResult.outcome === 'accepted')
			{
				this.setState({
					installPromptSnackbarContent: "Installed! You're gonna love it, I promise."
				});
			}
			else
			{
				this.setState({
					installPromptSnackbarContent: "You promised to install it and then didn't. I can't believe this."
				});
			}
		});
	};

	private onInstallPromptSnackbarClose = () => this.setState({
		installPromptSnackbarContent: null
	});

	public render()
	{
		return (
			<React.Fragment>
				<Helmet defaultTitle={"Baseball Theater"} titleTemplate={"%s | Baseball Theater"}/>
				<ScrollMemory/>
				<div className={styles.wrapper}>
					<nav className={styles.nav}>
						<Respond at={RespondSizes.medium}>
							<SidebarDrawer authContext={this.state.authContext}/>
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
						<Container maxWidth={"xl"} style={{position: "relative"}}>
							<Grid container>
								<ErrorBoundary>
									<Routes/>
								</ErrorBoundary>
							</Grid>
						</Container>
					</main>
					<Dialog
						open={this.state.showInstallPromptDialog}
						onClose={this.onInstallDialogClose}
					>
						<DialogTitle>
							Install Baseball Theater
						</DialogTitle>
						<DialogContent>
							<DialogContentText>
								You enjoy Baseball Theater, right? I mean, it's pretty great. Did you know you can install it like a normal app and access it all the time?
								<br/><br/>
								Do you want to install?
								<br/>
								<small>Seriously, it's super convenient.</small>
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.onInstallDialogClose} color="primary">
								No, leave me alone.
							</Button>
							<Button autoFocus onClick={this.onInstallDialogApprove} color="primary">
								Yes, I need this in my life.
							</Button>
						</DialogActions>
					</Dialog>
					<Snackbar
						open={!!this.state.installPromptSnackbarContent}
						onClose={this.onInstallPromptSnackbarClose}
						message={this.state.installPromptSnackbarContent}
					/>
				</div>
			</React.Fragment>
		);
	}
}

export default withRouter(App);