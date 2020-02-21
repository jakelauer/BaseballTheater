import * as React from "react";
import {LiveData, LiveGamePlay} from "baseball-theater-engine";
import {PlayItem} from "./Components/PlayItem";
import {Button, Collapse, List, ListItem, ListItemText, Menu, MenuItem, Tab, Tabs} from "@material-ui/core";
import {StringUtils} from "../../Utility/StringUtils";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import styles from "./LiveGame.module.scss";
import {RespondDataStore, RespondDataStorePayload, RespondSizes} from "../../Global/Respond/RespondDataStore";
import Helmet from "react-helmet";
import moment from "moment";
import {ContainerProgress} from "../../UI/ContainerProgress";
import {IoIosMenu} from "react-icons/all";

type HalfInnings = { [key: string]: IHalfInning };

interface ILiveGameProps
{
	liveData: LiveData;
}

interface DefaultProps
{
}

type Props = ILiveGameProps & DefaultProps;
type State = ILiveGameState;

interface ILiveGameState
{
	selectedInning: number;
	respond: RespondDataStorePayload;
	halfInnings: HalfInnings[];
	halfInningsKeysSorted: string[][];
	inningMenuOpen: boolean;
}

interface IHalfInning
{
	inningNumber: number;
	halfInning: "top" | "bottom";
	plays: LiveGamePlay[];
}

export class LiveGame extends React.Component<Props, State>
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
			inningMenuOpen: false
		};
	}

	public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void
	{
		let shouldUpdate = false;
		let newState: State = {...this.state};

		if (this.props.liveData && this.state.selectedInning === -1)
		{
			shouldUpdate = true;
			newState.selectedInning = this.props.liveData.liveData.linescore.innings.length;
		}

		if (!this.state.halfInnings.length && !!this.props.liveData?.liveData)
		{
			newState.halfInnings = this.getHalfInningsByInning();
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

	private getHalfInningsByInning()
	{
		const liveData = this.props.liveData?.liveData;
		if (!liveData)
		{
			return [];
		}

		const allInnings = liveData.linescore.innings.map((inning, i) =>
		{
			const playsForInning = liveData.plays.allPlays.filter(a => a.about.inning === i + 1);
			const playsByInning: { [key: string]: IHalfInning } = {};
			let lastInningVal = "-1bottom";

			for (let play of playsForInning)
			{
				const inningVal = `${play.about.inning}${play.about.halfInning}`;
				const isNew = inningVal !== lastInningVal;
				if (isNew)
				{
					playsByInning[inningVal] = {
						inningNumber: play.about.inning,
						halfInning: play.about.halfInning,
						plays: []
					}
				}

				playsByInning[inningVal].plays.push(play);

				lastInningVal = inningVal;
			}

			return playsByInning;
		});

		return allInnings;
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
			<div className={styles.inningWrapper}>
				<Helmet>
					<title>{`Play-by-play - ${teams.away.teamName} @ ${teams.home.teamName}, ${date}`}</title>
				</Helmet>
				{!isMedium && (
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
								<Tab key={i} label={inning.ordinalNum} value={inning.num}/>
							))
						}
					</Tabs>
				)}
				{isMedium && (
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
								liveData.linescore.innings.map((inning, i) => (
									<MenuItem onClick={_ => this.onMenuSelect(i + 1)}>{inning.ordinalNum} Inning</MenuItem>
								))
							}
						</Menu>
					</React.Fragment>
				)}

				{halfInnings && keys &&
                <Inning
                    halfInnings={halfInnings}
                    keysSorted={keys}
                />
				}
			</div>
		);

	}
}

interface IHalfInningProps
{
	halfInning: IHalfInning;
	defaultOpen: boolean;
}

const HalfInning = ({halfInning, defaultOpen}: IHalfInningProps) =>
{
	const [open, setOpen] = React.useState(defaultOpen);
	const playsSorted = halfInning.plays;
	const renderedPlays = playsSorted.map((p, i) => <PlayItem play={p} key={i}/>);
	const halfLabel = `${StringUtils.toProperCase(halfInning.halfInning)} ${halfInning.inningNumber}`;

	const handleClick = () => setOpen(!open);

	return (
		<React.Fragment>
			<ListItem button onClick={handleClick}>
				<ListItemText primary={<h2>{halfLabel}</h2>}/>
				{open ? <ExpandLess/> : <ExpandMore/>}
			</ListItem>
			<Collapse in={open}>
				{renderedPlays}
			</Collapse>
		</React.Fragment>
	);
};


interface IInningProps
{
	halfInnings: HalfInnings;
	keysSorted: string[];
}

class Inning extends React.Component<IInningProps>
{
	public render()
	{
		const renderedHalfInnings = this.props.keysSorted.map((k, i) =>
			<HalfInning key={k} halfInning={this.props.halfInnings[k]} defaultOpen={true}/>
		);

		return (
			<List>
				{renderedHalfInnings}
			</List>
		);
	}
};
