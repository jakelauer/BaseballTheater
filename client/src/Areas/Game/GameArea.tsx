import { CircularProgress, IconButton, Tabs } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Tab from '@material-ui/core/Tab';
import { ArrowBack, LibraryBooks, ListAlt, PlayCircleOutline, Sync, TableChart } from '@material-ui/icons';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { ErrorBoundary } from '../../App/ErrorBoundary';
import { AuthDataStore, BackerType } from '../../Global/AuthDataStore';
import { Respond } from '../../Global/Respond/Respond';
import { RespondDataStore, RespondSizes } from '../../Global/Respond/RespondDataStore';
import { GameTabs, IGameParams, IGameTabParams, SiteRoutes } from '../../Global/Routes/Routes';
import { SettingsDataStore } from '../../Global/Settings/SettingsDataStore';
import { useDataStore } from '../../Utility/HookUtils';
import { BoxScore } from './BoxScore';
import { GameDataStore, GameDataStoreContext } from './Components/GameDataStore';
import styles from './GameArea.module.scss';
import { Highlights } from './Highlights';
import { Live } from './Live';
import { Plays } from './Plays';
import { Wrap } from './Wrap';

let gameDataStore: GameDataStore;

const GameArea: React.FC = () => {
	const params = useParams<IGameTabParams>();
	const upsellAnchor = React.createRef<HTMLDivElement>();

	const authData = useDataStore(AuthDataStore);
	const [tabValue, setTabValue] = useState<string>(params.tab);

	if (!gameDataStore) {
		gameDataStore = new GameDataStore(params.gameId);
	}

	const gameData = useDataStore(gameDataStore);

	useEffect(() => {
		gameDataStore.initialize(params.gameId)
	}, [params.gameId]);

	useEffect(() => {
		setTabValue(params.tab);
	}, [params.tab]);

	useEffect(() => {
		gameDataStore.setMs(AuthDataStore.hasLevel(BackerType.Backer) ? 5000 : 30000);
	}, [authData.levels]);

	const handleChange = (e: React.ChangeEvent<{}>, value: string) => {
		setTabValue(value);

		window.history.replaceState(null, null, getTab(value as GameTabs));
	};

	const renderTab = () => {
		if (!gameData) {
			return <CircularProgress />;
		}

		let content = null;
		switch (tabValue) {
			case "Wrap":
				content = <Wrap media={gameData.media} liveData={gameData.liveData} />;
				break;
			case "LiveGame":
				content = <Live liveData={gameData.liveData} />;
				break;
			case "Plays":
				content = <Plays liveData={gameData.liveData} />;
				break;
			case "BoxScore":
				content = <BoxScore liveData={gameData.liveData} />;
				break;
			case "Highlights":
				content = <Highlights media={gameData.media} gamePk={params.gameId} liveData={gameData.liveData} />;
				break;
		}

		return (
			<ErrorBoundary>
				{content}
			</ErrorBoundary>
		);
	}

	const hasWrap = () => {
		const media = gameData.media;

		const noWrap = !media
			|| !media.editorial
			|| !media.editorial.recap
			|| !media.editorial.recap.mlb;

		return !noWrap;
	}

	const getTab = (tab: GameTabs) => {
		const gameId = params.gameId;
		return SiteRoutes.GameTab.resolve({ gameId, tab, gameDate: "_" });
	}

	if (!params.tab) {
		return <Navigate replace to={SiteRoutes.GameTab.resolve({
			...params as IGameParams,
			tab: SettingsDataStore.state.defaultGameTab
		})} />;
	}

	const tabs = [
		{
			label: "Videos",
			disabled: false,
			icon: <PlayCircleOutline />,
			value: "Highlights",
		},
		{
			label: "Live Play",
			disabled: hasWrap(),
			icon: <Sync />,
			value: "LiveGame",
		},
		{
			label: "Plays",
			disabled: false,
			icon: <ListAlt />,
			value: "Plays",
		},
		{
			label: "Box Score",
			disabled: false,
			icon: <TableChart />,
			value: "BoxScore",
		},
		{
			label: "Recap",
			disabled: !hasWrap(),
			icon: <LibraryBooks />,
			value: "Wrap",
		},
	];

	const barValue = (gameData.secondsUntilRefresh) / (gameDataStore.refreshSeconds) * 100;

	const validTabs = tabs.filter(a => !a.disabled);

	return (
		<>
			<div className={styles.gameWrapper}>
				<GameDataStoreContext.Provider value={gameDataStore.state}>
					<Respond at={RespondSizes.medium} hide={false}>
						{!gameData.cancelled && (
							<RefreshTimer barValue={barValue} secondsUntilRefresh={gameData.secondsUntilRefresh} />
						)}
					</Respond>
					<Respond at={RespondSizes.medium} hide={true}>
						<Tabs
							className={styles.tabs}
							value={tabValue}
							onChange={handleChange}
							centered={true}
							indicatorColor={"primary"}
							textColor="primary"
						>
							{gameDataStore?.state?.liveData?.gameData && (
								<Link to={SiteRoutes.Games.resolve({ yyyymmdd: gameDataStore?.state?.liveData?.gameData?.datetime?.originalDate.replace(/-/g, "") })}>
									<IconButton aria-label="back" color='primary' size={'medium'} style={{ height: "3.5rem", zIndex: 4000 }}>
										<ArrowBack />
									</IconButton>
								</Link>
							)}
							{!gameData.cancelled && (
								<RefreshTimer barValue={barValue} secondsUntilRefresh={gameData.secondsUntilRefresh} />
							)}
							{validTabs.map((tab, i) => (
								<Tab
									key={tab.label}
									label={tab.label}
									value={tab.value}
									style={{
										height: "3.5rem",
										marginLeft: i === 0 ? "auto" : "",
										marginRight: i === validTabs.length - 1 ? "auto" : undefined
									}}
								/>
							))}
						</Tabs>
					</Respond>
					<div className={styles.content}>
						{renderTab()}
					</div>
					<Respond at={RespondSizes.medium} hide={false}>
						<BottomNavigation
							value={tabValue}
							onChange={handleChange}
							className={styles.root}
							showLabels
						>
							{validTabs.map(tab => (
								<BottomNavigationAction
									style={{ minWidth: 0 }}
									key={tab.label}
									label={tab.label}
									icon={tab.icon}
									value={tab.value}
								/>
							))}
						</BottomNavigation>
					</Respond>
				</GameDataStoreContext.Provider>
			</div>
			<div className={styles.upsellAnchor} ref={upsellAnchor} />
		</>
	);
}


const RefreshTimer: React.FC<{ barValue: number, secondsUntilRefresh: number }> = ({ barValue, secondsUntilRefresh }) => {
	const settings = useDataStore(SettingsDataStore);
	const respond = useDataStore(RespondDataStore);

	if (!settings.showUpdateBar) {
		return null;
	}

	const secs = Math.floor(secondsUntilRefresh);

	return (
		<div className={classNames(styles.progressBar, {
			[styles.mobile]: RespondDataStore.test(RespondSizes.medium)
		})}>
			<CircularProgress
				classes={{
					root: classNames({
						[styles.progressBarNoAnim]: barValue >= 90,
					})
				}}
				variant={secondsUntilRefresh <= 0 ? "indeterminate" : "determinate"}
				value={barValue}
			/>
			<div className={styles.innerNumber}>{secs > 0 ? secs : ""}</div>
		</div>
	);
}

export default GameArea;