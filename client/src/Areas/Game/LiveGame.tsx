import * as React from "react";
import {LiveData, LiveGamePlay} from "baseball-theater-engine";
import {PlayItem} from "./Components/PlayItem";
import {CircularProgress, Collapse, List, ListItem, ListItemText, Tab, Tabs} from "@material-ui/core";
import {StringUtils} from "../../Utility/StringUtils";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import styles from "./LiveGame.module.scss";
import RespondIntercom, {RespondIntercomPayload, RespondSizes} from "../../Global/Respond/RespondIntercom";

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
	respond: RespondIntercomPayload;
}

interface IHalfInning
{
	inningNumber: number;
	halfInning: "top" | "bottom";
	plays: LiveGamePlay[];
}

export class LiveGame extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			selectedInning: props.liveData ? props.liveData.liveData.linescore.innings.length - 1 : 1,
			respond: {
				sizes: []
			}
		};
	}

	public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void
	{
		if (this.props.liveData && this.state.selectedInning === 0)
		{
			this.setState({
				selectedInning: this.props.liveData.liveData.linescore.innings.length
			});
		}
	}

	public componentDidMount(): void
	{
		RespondIntercom.listen(data => this.setState({
			respond: data
		}));
	}

	private getHalfInningsForSelectedInning()
	{
		const liveData = this.props.liveData.liveData;
		const selectedInningPlays = liveData.plays.allPlays.filter(a => a.about.inning === this.state.selectedInning);

		const playsByInning: { [key: string]: IHalfInning } = {};
		let lastInningVal = "-1bottom";

		for (let play of selectedInningPlays)
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
	}

	private onInningSelect = (event: any, inning: number) => this.setState({selectedInning: inning});

	public render()
	{
		if (!this.props.liveData)
		{
			return <CircularProgress/>;
		}

		const liveData = this.props.liveData.liveData;
		const plays = liveData.plays;
		const halfInnings = this.getHalfInningsForSelectedInning();
		const playsByInningKeys = Object.keys(halfInnings).sort((a, b) =>
		{
			const aPlay = halfInnings[a];
			const bPlay = halfInnings[b];
			const aHalfVal = aPlay.halfInning.length / 10;
			const bHalfVal = bPlay.halfInning.length / 10;
			const aInning = aPlay.inningNumber + aHalfVal;
			const bInning = bPlay.inningNumber + bHalfVal;
			return aInning - bInning;
		});

		const inningButtons = liveData.linescore.innings.map(inning =>
		{
			const color = inning.num === this.state.selectedInning ? "primary" : undefined;
			const variant = inning.num === this.state.selectedInning ? "contained" : undefined;

			return <Tab label={`${inning.num}`} value={inning.num} />;
		});

		const renderedHalfInnings = playsByInningKeys.map((k, i) =>
			<HalfInning key={k} halfInning={halfInnings[k]} defaultOpen={true}/>
		);

		const orientation = this.state.respond.sizes.indexOf(RespondSizes.medium) > -1
			? "horizontal"
			: "vertical";

		return (
			<div className={styles.inningWrapper}>
				<Tabs
					className={styles.inningTabs}
					orientation={orientation}
					variant="scrollable"
					value={this.state.selectedInning}
					onChange={this.onInningSelect}
					indicatorColor="primary"
					textColor="primary"
				>
					{inningButtons}
				</Tabs>
				<List>
					{renderedHalfInnings}
				</List>
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
	const halfLabel = StringUtils.toProperCase(halfInning.halfInning);

	const handleClick = () => setOpen(!open);

	return (
		<React.Fragment>
			<ListItem button onClick={handleClick}>
				<ListItemText primary={<h2>{halfLabel}</h2>}/>
				{open ? <ExpandLess/> : <ExpandMore/>}
			</ListItem>
			<Collapse in={open}>
				<List>
					{renderedPlays}
				</List>
			</Collapse>
		</React.Fragment>
	);
};