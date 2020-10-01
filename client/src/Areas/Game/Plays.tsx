import * as React from "react";
import {LiveData} from "baseball-theater-engine";
import {Button, ButtonGroup, Menu, MenuItem, Tab, Tabs} from "@material-ui/core";
import styles from "./Plays.module.scss";
import {RespondDataStore, RespondDataStorePayload, RespondSizes} from "../../Global/Respond/RespondDataStore";
import Helmet from "react-helmet";
import moment from "moment";
import {ContainerProgress} from "../../UI/ContainerProgress";
import {IoIosMenu} from "react-icons/all";
import {MiniBoxScore} from "./Components/MiniBoxScore";
import {ScoringPlays} from "./Components/ScoringPlays";
import {IGameParams, SiteRoutes} from "../../Global/Routes/Routes";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {PlayUtils} from "./Utils/PlayUtils";
import {HalfInnings, Inning} from "./Components/Innings";


interface IPlaysProps extends RouteComponentProps<IGameParams>
{
	liveData: LiveData;
}

interface DefaultProps
{
}

type Props = IPlaysProps & DefaultProps;
type State = IPlaysState;

interface IPlaysState
{
	selectedInning: number;
	respond: RespondDataStorePayload;
	halfInnings: HalfInnings[];
	halfInningsKeysSorted: string[][];
	inningMenuOpen: boolean;
	mode: "scoring" | "all";
}

class _Plays extends React.Component<Props, State>
{
	private buttonRef = React.createRef<HTMLButtonElement>();

	constructor(props: Props)
	{
		super(props);

		this.state = {
			selectedInning: props.liveData ? props.liveData.liveData.linescore.innings.length : -1,
			respond: {
				sizes: []
			},
			halfInnings: [],
			halfInningsKeysSorted: [],
			inningMenuOpen: false,
			mode: props.match.params.tabDetail === "all" ? "all" : "scoring"
		};
	}

	public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void
	{
		let shouldUpdate = false;
		let newState: State = {...this.state};

		if (this.props.liveData?.liveData.linescore?.innings && this.state.selectedInning === -1)
		{
			shouldUpdate = true;
			const innings = this.props.liveData?.liveData?.linescore?.innings.filter(a => !!a);
			newState.selectedInning = innings.length;
		}

		if (!this.state.halfInnings.length && !!this.props.liveData?.liveData)
		{
			newState.halfInnings = PlayUtils.getHalfInningsByInning(this.props.liveData?.liveData);
			newState.halfInningsKeysSorted = newState.halfInnings.map(hi => Object.keys(hi).sort((a, b) =>
			{
				const aPlay = hi[a];
				const bPlay = hi[b];
				const aHalfVal = aPlay.halfInning.length / 10;
				const bHalfVal = bPlay.halfInning.length / 10;
				const aInning = aPlay.inningNumber + aHalfVal;
				const bInning = bPlay.inningNumber + bHalfVal;
				return aInning - bInning;
			}));
			shouldUpdate = true;
		}

		if (shouldUpdate)
		{
			this.setState(newState);
		}
	}

	public componentDidMount(): void
	{
		RespondDataStore.listen(data => this.setState({
			respond: data
		}));
	}

	private onInningSelect = (inning: number) => this.setState({selectedInning: inning});

	private onMenuClose = () => this.setState({
		inningMenuOpen: false
	});

	private onMenuSelect = (index: number) =>
	{
		window.scrollTo(0, 0);
		this.onInningSelect(index);
		this.onMenuClose();
	};

	private onPlayModeClick = (mode: "scoring" | "all") =>
	{
		this.setState({
			mode
		});

		history.replaceState(null, null, SiteRoutes.Game.resolve({
			gameDate: "_",
			gameId: this.props.liveData.gamePk.toString(),
			tab: "Plays",
			tabDetail: mode
		}));
	}

	public render()
	{
		if (!this.props.liveData)
		{
			return <ContainerProgress/>;
		}

		const liveData = this.props.liveData.liveData;

		const isMedium = this.state.respond.sizes.indexOf(RespondSizes.medium) > -1;

		const orientation = isMedium
			? "horizontal"
			: "vertical";

		const teams = this.props.liveData.gameData.teams;
		const date = moment(this.props.liveData.gameData.datetime.dateTime).format("MMMM D, YYYY");

		const halfInnings = this.state.halfInnings?.[this.state.selectedInning - 1];
		const keys = this.state.halfInningsKeysSorted?.[this.state.selectedInning - 1];

		return (
			<div className={styles.wrapper}>
				<Helmet>
					<title>{`Play-by-play - ${teams.away.teamName} @ ${teams.home.teamName}, ${date}`}</title>
				</Helmet>
				<div className={styles.miniBoxWrap}>
					<MiniBoxScore game={this.props.liveData}/>
				</div>
				<div className={styles.playTypes}>
					<ButtonGroup variant={"contained"}>
						<Button
							color={this.state.mode === "scoring" ? "primary" : "default"}
							onClick={() => this.onPlayModeClick("scoring")}
						>
							Scoring Plays
						</Button>
						<Button
							color={this.state.mode === "all" ? "primary" : "default"}
							onClick={() => this.onPlayModeClick("all")}
						>
							All Plays
						</Button>
					</ButtonGroup>
				</div>
				<div className={styles.inningWrapper}>
					{!isMedium && this.state.mode === "all" && (
						<Tabs
							className={styles.inningTabs}
							orientation={orientation}
							variant="scrollable"
							value={this.state.selectedInning}
							onChange={(e, i) => this.onInningSelect(i)}
							indicatorColor="primary"
							textColor="primary"
						>
							{
								liveData.linescore.innings.map((inning, i) => (
									<Tab key={i} label={inning?.ordinalNum} value={inning?.num}/>
								))
							}
						</Tabs>
					)}
					{this.state.mode === "all" && isMedium && (
						<React.Fragment>
							<div>
								<Button
									ref={this.buttonRef}
									aria-controls="simple-menu"
									aria-haspopup="true"
									className={styles.inningButton}
									color={"primary"}
									size={"large"}
									onClick={() => this.setState({inningMenuOpen: true})}
									variant={"contained"}
								>
									<IoIosMenu style={{
										marginRight: "0.5rem",
										fontSize: "1.5rem"
									}}/>
									{liveData.linescore.innings[this.state.selectedInning - 1]?.ordinalNum} Inning
								</Button>
							</div>
							<Menu
								keepMounted
								anchorEl={this.buttonRef.current}
								anchorOrigin={{
									horizontal: "center",
									vertical: "top"
								}}
								open={this.state.inningMenuOpen}
								onClose={this.onMenuClose}
							>
								{
									liveData.linescore.innings.slice(0, liveData.linescore.currentInning).map((inning, i) => (
										<MenuItem onClick={_ => this.onMenuSelect(i + 1)}>
											{inning?.ordinalNum
												? `${inning?.ordinalNum} Inning`
												: `Inning ${i + 1}`}
										</MenuItem>
									))
								}
							</Menu>
						</React.Fragment>
					)}

					{halfInnings && keys && this.state.mode === "all" && (
						<Inning
							isCurrentInning={this.state.selectedInning === liveData.linescore.currentInning}
							halfInnings={halfInnings}
							keysSorted={keys}
						/>
					)}

					{this.state.mode === "scoring" && (
						<ScoringPlays
							liveData={liveData}
						/>
					)}
				</div>
			</div>
		);

	}
}


export const Plays = withRouter(_Plays);