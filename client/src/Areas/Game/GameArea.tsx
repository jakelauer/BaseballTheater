import * as React from "react";
import styles from "./GameArea.module.scss";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {LibraryBooks, ListAlt, PlayCircleOutline, Update} from "@material-ui/icons";
import {RouteComponentProps, withRouter} from "react-router";
import {GameTabs, IGameParams, SiteRoutes} from "../../Global/Routes/Routes";
import {Wrap} from "./Wrap";
import {LiveGame} from "./LiveGame";
import {BoxScore} from "./BoxScore";
import {Highlights} from "./Highlights";
import {GameIntercom, IGameIntercomState} from "./Components/GameIntercom";
import {Link} from "react-router-dom";
import {CircularProgress} from "@material-ui/core";

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
	gameData: IGameIntercomState;
}

class GameArea extends React.Component<Props, State>
{
	private readonly gameIntercom: GameIntercom;

	constructor(props: Props)
	{
		super(props);

		this.gameIntercom = new GameIntercom(this.props.match.params.gameId);

		this.state = {
			tabValue: props.match.params.tab,
			gameData: this.gameIntercom.state
		};
	}

	public componentDidMount(): void
	{
		this.gameIntercom.listen(gameData => this.setState({gameData}));
	}

	public componentWillUnmount(): void
	{
		this.gameIntercom.cancel();
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
			return <CircularProgress />;
		}

		switch (this.props.match.params.tab)
		{
			case "Wrap":
				return <Wrap gameIntercom={this.gameIntercom}/>;
			case "LiveGame":
				return <LiveGame liveData={this.state.gameData.liveData}/>;
			case "BoxScore":
				return <BoxScore liveData={this.state.gameData.liveData}/>;
			case "Highlights":
				return <Highlights media={this.state.gameData.media} gamePk={this.props.match.params.gameId}/>;
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
		return SiteRoutes.Game.resolve({gameId, tab});
	}

	public render()
	{
		const wrapLink = this.getTab("Wrap");
		const liveGameLink = this.getTab("LiveGame");
		const boxScoreLink = this.getTab("BoxScore");
		const highlightsLink = this.getTab("Highlights");

		return (
			<div className={styles.gameWrapper}>
				<div className={styles.content}>
					{this.renderTab()}
				</div>
				<BottomNavigation
					value={this.state.tabValue}
					onChange={this.handleChange}
					showLabels
					className={styles.root}
				>
                    <BottomNavigationAction
	                    label="Wrap"
	                    disabled={!this.hasWrap()}
	                    icon={<LibraryBooks/>}
	                    value={"Wrap"}
	                    component={p => <Link {...p} replace={true} to={wrapLink}/>}
                    />

					<BottomNavigationAction
						label="Play-by-play"
						icon={<Update/>}
						value={"LiveGame"}
						component={p => <Link {...p} replace={true} to={liveGameLink}/>}
					/>

					<BottomNavigationAction
						label="Box Score"
						icon={<ListAlt/>}
						value={"BoxScore"}
						component={p => <Link {...p} replace={true} to={boxScoreLink}/>}
					/>

					<BottomNavigationAction
						label="Highlights"
						icon={<PlayCircleOutline/>}
						value={"Highlights"}
						component={p => <Link {...p} replace={true} to={highlightsLink}/>}
					/>
				</BottomNavigation>
			</div>
		);
	}
}

export default withRouter(GameArea);