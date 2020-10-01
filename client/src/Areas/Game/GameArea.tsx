import * as React from "react";
import styles from "./GameArea.module.scss";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {Redirect, RouteComponentProps, withRouter} from "react-router";
import {GameTabs, IGameParams, SiteRoutes} from "../../Global/Routes/Routes";
import {Wrap} from "./Wrap";
import {Plays} from "./Plays";
import {BoxScore} from "./BoxScore";
import {Highlights} from "./Highlights";
import {GameDataStore, GameDataStoreContext, IGameDataStorePayload} from "./Components/GameDataStore";
import {CircularProgress, LinearProgress, Tabs} from "@material-ui/core";
import {Respond} from "../../Global/Respond/Respond";
import {RespondSizes} from "../../Global/Respond/RespondDataStore";
import {LibraryBooks, ListAlt, PlayCircleOutline, Sync, TableChart} from "@material-ui/icons";
import Tab from "@material-ui/core/Tab";
import {SettingsDataStore} from "../../Global/Settings/SettingsDataStore";
import {ErrorBoundary} from "../../App/ErrorBoundary";
import {Live} from "./Live";
import {AuthDataStore, BackerType, IAuthContext} from "../../Global/AuthDataStore";
import classNames from "classnames";
import {useDataStore} from "../../Utility/HookUtils";

interface IGameAreaProps extends RouteComponentProps<IGameParams>
{
}

interface DefaultProps
{
}

type Props = IGameAreaProps & DefaultProps;
type State = IGameAreaState;

interface IGameAreaState
{
	tabValue: string;
	gameData: IGameDataStorePayload;
	authData: IAuthContext;
}

class GameArea extends React.Component<Props, State>
{
	private readonly gameDataStore: GameDataStore;
	private readonly upsellAnchor = React.createRef<HTMLDivElement>();

	constructor(props: Props)
	{
		super(props);

		this.gameDataStore = new GameDataStore(this.props.match.params.gameId);

		this.state = {
			authData: AuthDataStore.state,
			tabValue: props.match.params.tab,
			gameData: this.gameDataStore.state
		};
	}

	public componentDidMount(): void
	{
		this.gameDataStore.listen(gameData =>
		{
			this.setState({gameData});
		});

		AuthDataStore.listen(authData =>
		{
			this.setState({authData});
			this.gameDataStore.setMs(AuthDataStore.hasLevel(BackerType.Backer) ? 10000 : 30000);
		});
	}

	public componentWillUnmount(): void
	{
		this.gameDataStore.cancel();
	}

	private handleChange = (e: React.ChangeEvent<{}>, value: string) =>
	{
		this.setState({
			tabValue: value
		});

		history.replaceState(null, null, this.getTab(value as GameTabs));
	};

	private renderTab()
	{
		if (!this.state.gameData)
		{
			return <CircularProgress/>;
		}

		let content = null;
		switch (this.state.tabValue)
		{
			case "Wrap":
				content = <Wrap media={this.state.gameData.media} liveData={this.state.gameData.liveData}/>;
				break;
			case "LiveGame":
				content = <Live liveData={this.state.gameData.liveData}/>;
				break;
			case "Plays":
				content = <Plays liveData={this.state.gameData.liveData}/>;
				break;
			case "BoxScore":
				content = <BoxScore liveData={this.state.gameData.liveData}/>;
				break;
			case "Highlights":
				content = <Highlights media={this.state.gameData.media} gamePk={this.props.match.params.gameId} liveData={this.state.gameData.liveData}/>;
				break;
		}

		return (
			<ErrorBoundary>
				{content}
			</ErrorBoundary>
		);
	}

	private hasWrap()
	{
		const media = this.state.gameData.media;

		const noWrap = !media
			|| !media.editorial
			|| !media.editorial.recap
			|| !media.editorial.recap.mlb;

		return !noWrap;
	}

	private getTab(tab: GameTabs)
	{
		const gameId = this.props.match.params.gameId;
		return SiteRoutes.Game.resolve({gameId, tab, gameDate: "_"});
	}

	public render()
	{
		if (!this.props.match.params.tab)
		{
			return <Redirect to={SiteRoutes.Game.resolve({
				...this.props.match.params,
				tab: SettingsDataStore.state.defaultGameTab
			})}/>;
		}

		const tabs = [
			{
				label: "Videos",
				disabled: false,
				icon: <PlayCircleOutline/>,
				value: "Highlights",
			},
			{
				label: "Live Play",
				disabled: this.hasWrap(),
				icon: <Sync/>,
				value: "LiveGame",
			},
			{
				label: "Plays",
				disabled: false,
				icon: <ListAlt/>,
				value: "Plays",
			},
			{
				label: "Box Score",
				disabled: false,
				icon: <TableChart/>,
				value: "BoxScore",
			},
			{
				label: "Recap",
				disabled: !this.hasWrap(),
				icon: <LibraryBooks/>,
				value: "Wrap",
			},
		];

		const barValue = (this.state.gameData.secondsUntilRefresh - 1) / (this.gameDataStore.refreshSeconds - 1) * 100;

		return (
			<>
				<div className={styles.gameWrapper}>
					<GameDataStoreContext.Provider value={this.gameDataStore.state}>
						<Respond at={RespondSizes.medium} hide={false}>
							{!this.state.gameData.cancelled && (
								<RefreshTimer barValue={barValue}/>
							)}
						</Respond>
						<Respond at={RespondSizes.medium} hide={true}>
							<Tabs
								className={styles.tabs}
								value={this.state.tabValue}
								onChange={this.handleChange}
								centered={true}
								indicatorColor={"primary"}
								textColor="primary"
							>
								{!this.state.gameData.cancelled && (
									<RefreshTimer barValue={barValue}/>
								)}
								{tabs.filter(a => !a.disabled).map(tab => (
									<Tab
										key={tab.label}
										style={{height: "3.5rem"}}
										label={tab.label}
										value={tab.value}
									/>
								))}
							</Tabs>
						</Respond>
						<div className={styles.content}>
							<ErrorBoundary>
								{this.renderTab()}
							</ErrorBoundary>
						</div>
						<Respond at={RespondSizes.medium} hide={false}>
							<BottomNavigation
								value={this.state.tabValue}
								onChange={this.handleChange}
								className={styles.root}
								showLabels
							>
								{tabs.filter(a => !a.disabled).map(tab => (
									<BottomNavigationAction
										style={{minWidth: 0}}
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
				<div className={styles.upsellAnchor} ref={this.upsellAnchor}/>
			</>
		);
	}
}


const RefreshTimer: React.FC<{ barValue: number }> = ({barValue}) =>
{
	const settings = useDataStore(SettingsDataStore);

	if (!settings.showUpdateBar)
	{
		return null;
	}

	return (
		<LinearProgress
			classes={{
				bar1Determinate: classNames(styles.progressBar, {[styles.progressBarNoAnim]: barValue >= 90})
			}}
			variant={"determinate"}
			value={barValue}
			style={{position: "absolute", top: 0, left: 0, right: 0, zIndex: 99}}
		/>
	);
}

export default withRouter(GameArea);