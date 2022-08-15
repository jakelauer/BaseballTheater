import { Button, ButtonGroup, Menu, MenuItem, Tab, Tabs } from '@material-ui/core';
import { LiveData } from 'baseball-theater-engine';
import moment from 'moment';
import { useEffect, useState } from 'react';
import React from 'react';
import Helmet from 'react-helmet';
import { IoIosMenu } from 'react-icons/all';
import { useParams } from 'react-router-dom';

import { usePrevious } from '../../Global/Hooks/usePrevious';
import { useDataStore } from '../../Global/Intercom/DataStore';
import { RespondDataStore, RespondDataStorePayload, RespondSizes } from '../../Global/Respond/RespondDataStore';
import { IGameParams, SiteRoutes } from '../../Global/Routes/Routes';
import { ContainerProgress } from '../../UI/ContainerProgress';
import { HalfInnings, Inning } from './Components/Innings';
import { MiniBoxScore } from './Components/MiniBoxScore';
import { ScoringPlays } from './Components/ScoringPlays';
import styles from './Plays.module.scss';
import { PlayUtils } from './Utils/PlayUtils';


interface IPlaysProps {
	liveData: LiveData;
}

interface DefaultProps {
}

type Props = IPlaysProps & DefaultProps;
type State = IPlaysState;

interface IPlaysState {
	selectedInning: number;
	respond: RespondDataStorePayload;
	halfInnings: HalfInnings[];
	halfInningsKeysSorted: string[][];
	inningMenuOpen: boolean;
	mode: "scoring" | "all";
}

export const Plays: React.FC<Props> = (props) => {
	const params = useParams<IGameParams>();
	const buttonRef = React.createRef<HTMLButtonElement>();
	const prevProps = usePrevious(props);

	const [selectedInning, setSelectedInning] = useState(props.liveData ? props.liveData.liveData.linescore.innings.length : -1);
	const respond = useDataStore(RespondDataStore);
	const [halfInnings, setHalfInnings] = useState<HalfInnings[]>([]);
	const [halfInningsKeysSorted, sethalfInningsKeysSorted] = useState<string[][]>([]);
	const [inningMenuOpen, setInningMenuOpen] = useState(false);
	const [mode, setMode] = useState<"scoring" | "all">(params.tabDetail === "all" ? "all" : "scoring");

	useEffect(() => {
		if (props.liveData?.liveData.linescore?.innings && selectedInning === -1) {
			const innings = props.liveData?.liveData?.linescore?.innings.filter(a => !!a);
			setSelectedInning(innings.length);
		}

		if (!halfInnings.length && !!props.liveData?.liveData) {
			const newHalfInnings = PlayUtils.getHalfInningsByInning(props.liveData?.liveData);
			const newHalfInningsKeysSorted = newHalfInnings.map(hi => Object.keys(hi).sort((a, b) => {
				const aPlay = hi[a];
				const bPlay = hi[b];
				const aHalfVal = aPlay.halfInning.length / 10;
				const bHalfVal = bPlay.halfInning.length / 10;
				const aInning = aPlay.inningNumber + aHalfVal;
				const bInning = bPlay.inningNumber + bHalfVal;
				return aInning - bInning;
			}));

			setHalfInnings(newHalfInnings);
			sethalfInningsKeysSorted(newHalfInningsKeysSorted);
		}
	}, [props])

	const onInningSelect = (inning: number) => setSelectedInning(inning);

	const onMenuClose = () => setInningMenuOpen(false);

	const onMenuSelect = (index: number) => {
		window.scrollTo(0, 0);
		onInningSelect(index);
		onMenuClose();
	};

	const onPlayModeClick = (mode: "scoring" | "all") => {
		setMode(mode);

		history.replaceState(null, null, SiteRoutes.Game.resolve({
			gameDate: "_",
			gameId: props.liveData.gamePk.toString(),
			tab: "Plays",
			tabDetail: mode
		}));
	}

	if (!props.liveData) {
		return <ContainerProgress />;
	}

	const liveData = props.liveData.liveData;

	const isMedium = respond.sizes.indexOf(RespondSizes.medium) > -1;

	const orientation = isMedium
		? "horizontal"
		: "vertical";

	const teams = props.liveData.gameData.teams;
	const date = moment(props.liveData.gameData.datetime.dateTime).format("MMMM D, YYYY");

	const halfInningsChosen = halfInnings?.[selectedInning - 1];
	const keys = halfInningsKeysSorted?.[selectedInning - 1];

	return (
		<div className={styles.wrapper}>
			<Helmet>
				<title>{`Play-by-play - ${teams.away.teamName} @ ${teams.home.teamName}, ${date}`}</title>
			</Helmet>
			<div className={styles.miniBoxWrap}>
				<MiniBoxScore game={props.liveData} />
			</div>
			<div className={styles.playTypes}>
				<ButtonGroup variant={"contained"}>
					<Button
						color={mode === "scoring" ? "primary" : "default"}
						onClick={() => onPlayModeClick("scoring")}
					>
						Scoring Plays
					</Button>
					<Button
						color={mode === "all" ? "primary" : "default"}
						onClick={() => onPlayModeClick("all")}
					>
						All Plays
					</Button>
				</ButtonGroup>
			</div>
			<div className={styles.inningWrapper}>
				{!isMedium && mode === "all" && (
					<Tabs
						className={styles.inningTabs}
						orientation={orientation}
						variant="scrollable"
						value={selectedInning}
						onChange={(e, i) => onInningSelect(i)}
						indicatorColor="primary"
						textColor="primary"
					>
						{
							liveData.linescore.innings.map((inning, i) => (
								<Tab key={i} label={inning?.ordinalNum} value={inning?.num} />
							))
						}
					</Tabs>
				)}
				{mode === "all" && isMedium && (
					<React.Fragment>
						<div>
							<Button
								ref={buttonRef}
								aria-controls="simple-menu"
								aria-haspopup="true"
								className={styles.inningButton}
								color={"primary"}
								size={"large"}
								onClick={() => setInningMenuOpen(true)}
								variant={"contained"}
							>
								<IoIosMenu style={{
									marginRight: "0.5rem",
									fontSize: "1.5rem"
								}} />
								{liveData.linescore.innings[selectedInning - 1]?.ordinalNum} Inning
							</Button>
						</div>
						<Menu
							keepMounted
							anchorEl={buttonRef.current}
							anchorOrigin={{
								horizontal: "center",
								vertical: "top"
							}}
							open={inningMenuOpen}
							onClose={onMenuClose}
						>
							{
								liveData.linescore.innings.slice(0, liveData.linescore.currentInning).map((inning, i) => (
									<MenuItem onClick={_ => onMenuSelect(i + 1)}>
										{inning?.ordinalNum
											? `${inning?.ordinalNum} Inning`
											: `Inning ${i + 1}`}
									</MenuItem>
								))
							}
						</Menu>
					</React.Fragment>
				)}

				{halfInningsChosen && keys && mode === "all" && (
					<Inning
						isCurrentInning={selectedInning === liveData.linescore.currentInning}
						halfInnings={halfInningsChosen}
						keysSorted={keys}
					/>
				)}

				{mode === "scoring" && (
					<ScoringPlays
						liveData={liveData}
					/>
				)}
			</div>
		</div>
	);

}