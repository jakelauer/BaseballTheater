import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import { SystemUpdateAlt } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import React from 'react';
import { HamburgerArrow } from 'react-animated-burgers';
import { FaSearch } from 'react-icons/all';
import { useLocation } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';

import { IAuthContext } from '../Global/AuthDataStore';
import { SiteRoutes } from '../Global/Routes/Routes';
import { ServiceWorkerUpdate } from '../Global/ServiceWorkerUpdate';
import styles from './App.module.scss';
import Sidebar from './Sidebar';

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
	waitingForUpdate: boolean;
}

const SidebarDrawer: React.FC<ISidebarDrawerProps> = ({authContext}) =>
{
	const navigate = useNavigate();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [waitingForUpdate, setWaitingForUpdate] = useState(false);
	const location = useLocation();

	useEffect(() => {
		checkUpdates();
	}, []);

	const closeDrawer = () =>
	{
		setDrawerOpen(false);
	};

	const openDrawer = () =>
	{
		setDrawerOpen(true);
	};

	const checkUpdates = () =>
	{
		ServiceWorkerUpdate.checkForUpdates((hasUpdate) =>
		{
			setWaitingForUpdate(hasUpdate);
		});
	}

		const hamburgerActive = !(location.pathname.includes("games"));
		const onClick = hamburgerActive
			? () => navigate("/")
			: openDrawer;

		const updateIconShown = waitingForUpdate && !hamburgerActive;

		return (
			<React.Fragment>
				<AppBar position="fixed" className={styles.appBar}>
					<Toolbar className={styles.toolbar}>
						<IconButton edge="start" className={styles.menuButton} color="inherit" aria-label="back">
							{updateIconShown && (
								<SystemUpdateAlt onClick={onClick} fontSize={"large"}/>
							)}
							{!updateIconShown && (
								<HamburgerArrow isActive={hamburgerActive} barColor="white" buttonWidth={30} buttonStyle={{padding: 4, outline: "none"}} onClick={onClick}/>
							)}
						</IconButton>
						<span className={styles.logoText}>Baseball Theater</span>
						<div className={styles.barlogo}>
							<Link to={SiteRoutes.Search.resolve({})}>
								<FaSearch style={{color: "white"}}/>
							</Link>
						</div>
					</Toolbar>
				</AppBar>
				<SwipeableDrawer
					onClose={closeDrawer}
					onOpen={openDrawer}
					open={drawerOpen}
					disableBackdropTransition={true}
				>
					<Sidebar authContext={authContext} onNavigate={closeDrawer}/>
				</SwipeableDrawer>
			</React.Fragment>
		);
	}


export default SidebarDrawer;