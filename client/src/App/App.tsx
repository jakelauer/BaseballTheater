import { DialogContentText, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Drawer from '@material-ui/core/Drawer';
import Snackbar from '@material-ui/core/Snackbar';
import moment from 'moment';
import React, { ReactNode, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import Helmet from 'react-helmet';
import { RelayEnvironmentProvider } from 'react-relay';
import { useLocation } from 'react-router';

import { UpsellDataStore } from '../Areas/Game/Components/UpsellDataStore';
import { AuthDataStore, IAuthContext } from '../Global/AuthDataStore';
import { Respond } from '../Global/Respond/Respond';
import { RespondSizes } from '../Global/Respond/RespondDataStore';
import { Upsell } from '../UI/Upsell';
import { useDataStore } from '../Utility/HookUtils';
import styles from './App.module.scss';
import { ErrorBoundary } from './ErrorBoundary';
import RelayEnvironment from './RelayEnvironment';
import { RouteContainer } from './Routes';
import Sidebar from './Sidebar';
import SidebarDrawer from './SidebarDrawer';
import { UpdateAvailableDialog } from './UpdateAvailableDialog';

//@ts-ignore
interface IAppState {
	search: string;
	loading: boolean;
	authContext: IAuthContext;
	showInstallPromptDialog: boolean;
	installPromptSnackbarContent: ReactNode;
}

const App: React.FC = () => {
	let beforeInstallPromptEvent: BeforeInstallPromptEvent;

	const location = useLocation();

	const authContext = useDataStore(AuthDataStore);
	const [showInstallPromptDialog, setShowInstallPromptDialog] = useState(false);
	const [installPromptSnackbarContent, setInstallPromptSnackbarContent] = useState<ReactNode>(null);

	// constructor(props: RouteComponentProps)
	// {
	// 	super(props);

	// 	this.state = {
	// 		search: "",
	// 		loading: false,
	// 		authContext: AuthDataStore.state,
	// 		showInstallPromptDialog: false,
	// 		installPromptSnackbarContent: null,
	// 	};
	// }

	useEffect(() => {
		window.addEventListener("beforeinstallprompt", e => {
			e.preventDefault();

			beforeInstallPromptEvent = e as BeforeInstallPromptEvent;

			const visits = JSON.parse(localStorage.getItem("visits") ?? "0");
			const thirtyDaysAgo = moment().add(-30, "days");
			const declineDate = moment(localStorage.getItem("decline-date") ?? thirtyDaysAgo.add(-1, "minute").format());

			const expired = declineDate.isBefore(thirtyDaysAgo);

			if (visits > 3 && expired) {
				setShowInstallPromptDialog(true);
			}
		});
	}, []);

	useEffect(() => {
		ReactGA.pageview(window.location.pathname + window.location.search);
	}, [location.pathname]);

	const onInstallDialogClose = () => {
		setShowInstallPromptDialog(false);

		localStorage.setItem("decline-date", moment().format());
	};

	const onInstallDialogApprove = () => {
		onInstallDialogClose();
		beforeInstallPromptEvent?.prompt();

		// Wait for the user to respond to the prompt
		beforeInstallPromptEvent?.userChoice?.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				setInstallPromptSnackbarContent("Installed! You're gonna love it, I promise.");
			}
			else {
				setInstallPromptSnackbarContent("You promised to install it and then didn't. I can't believe this.");
			}
		});
	};

	const onInstallPromptSnackbarClose = () => setInstallPromptSnackbarContent(false);

	return (
		<RelayEnvironmentProvider environment={RelayEnvironment}>
			<Helmet defaultTitle={"Baseball Theater"} titleTemplate={"%s | Baseball Theater"} />
			<div className={styles.wrapper}>
				<nav className={styles.nav}>
					<Respond at={RespondSizes.medium}>
						<SidebarDrawer authContext={authContext} />
					</Respond>
					<Respond at={RespondSizes.medium} hide={true}>
						<Drawer anchor={"left"} variant={"persistent"} open={true} classes={{
							paper: styles.drawerPaper
						}}>
							<Sidebar authContext={authContext} />
						</Drawer>
					</Respond>
				</nav>
				<main className={styles.main}>
					<Container maxWidth={"xl"} style={{ position: "relative" }}>
						<Grid container>
							<ErrorBoundary>
								<RouteContainer />
							</ErrorBoundary>
						</Grid>
					</Container>
				</main>
				<Dialog
					open={showInstallPromptDialog}
					onClose={onInstallDialogClose}
				>
					<DialogTitle>
						Install Baseball Theater
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							You enjoy Baseball Theater, right? I mean, it's pretty great. Did you know you can install it like a normal app and access it all the time?
							<br /><br />
							Do you want to install?
							<br />
							<small>Seriously, it's super convenient.</small>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={onInstallDialogClose} color="primary">
							No, leave me alone.
						</Button>
						<Button autoFocus onClick={onInstallDialogApprove} color="primary">
							Yes, I need this in my life.
						</Button>
					</DialogActions>
				</Dialog>
				<UpdateAvailableDialog />
				<UpsellDialog />
				<Snackbar
					open={!!installPromptSnackbarContent}
					onClose={onInstallPromptSnackbarClose}
					message={installPromptSnackbarContent}
				/>
			</div>
		</RelayEnvironmentProvider>
	);
}

const UpsellDialog: React.FC = () => {
	const upsellData = useDataStore(UpsellDataStore);

	return (
		<Dialog
			id="simple-menu"
			keepMounted
			classes={{
				paper: styles.dialog
			}}
			open={upsellData.backerType !== null}
			onClose={() => UpsellDataStore.close()}
		>
			<Upsell isModal={true} levelRequired={upsellData.backerType} onCancel={() => UpsellDataStore.close()} />
		</Dialog>
	);
}

export default App;