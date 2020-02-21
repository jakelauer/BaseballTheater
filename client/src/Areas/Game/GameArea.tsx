import * as React from "react";
import styles from "./GameArea.module.scss";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {Redirect, RouteComponentProps, withRouter} from "react-router";
import {GameTabs, IGameParams, SiteRoutes} from "../../Global/Routes/Routes";
import {Wrap} from "./Wrap";
import {LiveGame} from "./LiveGame";
import {BoxScore} from "./BoxScore";
import {Highlights} from "./Highlights";
import {GameDataStore, GameDataStoreContext, IGameDataStorePayload} from "./Components/GameDataStore";
import {CircularProgress, Tabs} from "@material-ui/core";
import {Respond} from "../../Global/Respond/Respond";
import {RespondSizes} from "../../Global/Respond/RespondDataStore";
import {LibraryBooks, ListAlt, PlayCircleOutline, Update} from "@material-ui/icons";
import {Link} from "react-router-dom";
import Tab from "@material-ui/core/Tab";
import {Upsell} from "../../UI/Upsell";
import Dialog from "@material-ui/core/Dialog";
import {SettingsDataStore} from "../../Global/Settings/SettingsDataStore";

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
			tabValue: props.match.params.tab,
			gameData: this.gameDataStore.state
		};
	}

	public componentDidMount(): void
	{
		this.gameDataStore.listen(gameData => this.setState({gameData}));
	}

	public componentWillUnmount(): void
	{
		this.gameDataStore.cancel();
	}

	private handleChange = (e: React.ChangeEvent<{}>, value: string) =>
	{
		this.setState({
			tabValue: value
		})
	};

	private renderTab()
	{
		if (!this.state.gameData)
		{
			return <CircularProgress/>;
		}

		switch (this.props.match.params.tab)
		{
			case "Wrap":
				return <Wrap media={this.state.gameData.media} liveData={this.state.gameData.liveData}/>;
			case "LiveGame":
				return <LiveGame liveData={this.state.gameData.liveData}/>;
			case "BoxScore":
				return <BoxScore liveData={this.state.gameData.liveData}/>;
			case "Highlights":
				return <Highlights media={this.state.gameData.media} gamePk={this.props.match.params.gameId} liveData={this.state.gameData.liveData}/>;
		}
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

		const wrapLink = this.getTab("Wrap");
		const liveGameLink = this.getTab("LiveGame");
		const boxScoreLink = this.getTab("BoxScore");
		const highlightsLink = this.getTab("Highlights");

		const tabs = [
			{
				label: "Highlights",
				disabled: false,
				icon: <PlayCircleOutline/>,
				value: "Highlights",
				linkDestination: highlightsLink
			},
			{
				label: "Wrap",
				disabled: !this.hasWrap(),
				icon: <LibraryBooks/>,
				value: "Wrap",
				linkDestination: wrapLink
			},
			{
				label: "Play-by-play",
				disabled: false,
				icon: <Update/>,
				value: "LiveGame",
				linkDestination: liveGameLink
			},
			{
				label: "Box Score",
				disabled: false,
				icon: <ListAlt/>,
				value: "BoxScore",
				linkDestination: boxScoreLink
			},
		];


		return (
			<>
				<div className={styles.gameWrapper}>
					<GameDataStoreContext.Provider value={this.gameDataStore}>
						<Respond at={RespondSizes.medium} hide={true}>
							<Tabs
								className={styles.tabs}
								value={this.state.tabValue}
								onChange={this.handleChange}
								centered={true}
								indicatorColor={"primary"}
								textColor="primary"
							>
								{tabs.map(tab => (
									<Tab
										key={tab.label}
										style={{height: "3.5rem"}}
										label={tab.label}
										disabled={tab.disabled}
										value={tab.value}
										component={p => <Link {...p} replace={true} to={tab.linkDestination}/>}
									/>
								))}
							</Tabs>
						</Respond>
						<div className={styles.content}>
							{this.renderTab()}
						</div>
						<Respond at={RespondSizes.medium} hide={false}>
							<BottomNavigation
								value={this.state.tabValue}
								onChange={this.handleChange}
								showLabels
								className={styles.root}
							>
								{tabs.map(tab => (
									<BottomNavigationAction
										key={tab.label}
										label={tab.label}
										disabled={tab.disabled}
										icon={tab.icon}
										value={tab.value}
										component={p => <Link {...p} replace={true} to={tab.linkDestination}/>}
									/>
								))}
							</BottomNavigation>
						</Respond>
					</GameDataStoreContext.Provider>
				</div>
				<div className={styles.upsellAnchor} ref={this.upsellAnchor}/>
				<Dialog
					id="simple-menu"
					keepMounted
					classes={{
						paper: styles.dialog
					}}
					open={this.state.gameData.upsellBackerType !== null}
					onClose={() => this.gameDataStore.hideUpsell()}
				>
					<Upsell isModal={true} levelRequired={this.state.gameData.upsellBackerType} onCancel={() => this.gameDataStore.hideUpsell()}/>
				</Dialog>
			</>
		);
	}
}

export default withRouter(GameArea);