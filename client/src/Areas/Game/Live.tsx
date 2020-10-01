import {LiveData} from "baseball-theater-engine";
import styles from "./Plays.module.scss";
import liveStyles from "./Live.module.scss";
import Helmet from "react-helmet";
import {MiniBoxScore} from "./Components/MiniBoxScore";
import * as React from "react";
import {useEffect, useState} from "react";
import moment from "moment";
import {ContainerProgress} from "../../UI/ContainerProgress";
import {PlayUtils} from "./Utils/PlayUtils";
import {HalfInning} from "./Components/Innings";
import {List} from "@material-ui/core";
import classNames from "classnames";

interface ILiveProps
{
	liveData: LiveData;
}


export const Live: React.FC<ILiveProps> = ({liveData}) =>
{
	const [halfInnings, setHalfInnings] = useState(PlayUtils.getHalfInningsByInning(liveData?.liveData));

	useEffect(() =>
	{
		setHalfInnings(PlayUtils.getHalfInningsByInning(liveData?.liveData));
	}, [liveData]);

	if (!liveData || !halfInnings?.length)
	{
		return <ContainerProgress/>;
	}

	const getHalfInningForInningIndex = (index: number) =>
	{
		const currentHalfInnings = halfInnings[index] ?? {};
		const halfInningKey = Object.keys(currentHalfInnings)?.reverse()?.[0];

		return currentHalfInnings?.[halfInningKey];
	}

	const teams = liveData.gameData.teams;
	const date = moment(liveData.gameData.datetime.dateTime).format("MMMM D, YYYY");
	let halfInning = getHalfInningForInningIndex(liveData.liveData.linescore.currentInning - 1);
	if (halfInning?.plays?.every(p => p.pitchIndex.length === 0))
	{
		halfInning = getHalfInningForInningIndex(liveData.liveData.linescore.currentInning - 2);
	}

	if (!halfInning)
	{
		return null;
	}

	const {
		outs,
		balls,
		strikes,
		offense
	} = liveData.liveData.linescore;

	return (
		<div className={styles.wrapper}>
			<Helmet>
				<title>{`Live Plays - ${teams.away.teamName} @ ${teams.home.teamName}, ${date}`}</title>
			</Helmet>
			<div className={styles.miniBoxWrap}>
				<MiniBoxScore game={liveData}/>
			</div>
			<div className={liveStyles.status}>
				<div className={classNames(liveStyles.statusSection, liveStyles.diamond)}>
					<div className={liveStyles.inner}>
						<div>
							<Pip on={!!offense.third} className={"base"}/>
							<Pip on={!!offense.second} className={"base"}/>
						</div>
						<div>
							<Pip on={!!offense.first} className={"base"}/>
						</div>
					</div>
				</div>

				<div className={liveStyles.statusSection}>
					B: <Pip on={balls >= 1} className={"b"}/>
					<Pip on={balls >= 2} className={"b"}/>
					<Pip on={balls >= 3} className={"b"}/>
					<Pip on={balls >= 5} className={"b"}/>
				</div>

				<div className={liveStyles.statusSection}>
					S: <Pip on={strikes >= 1} className={"s"}/>
					<Pip on={strikes >= 2} className={"s"}/>
					<Pip on={strikes >= 3} className={"s"}/>
				</div>

				<div className={liveStyles.statusSection}>
					O: <Pip on={outs >= 1} className={"o"}/>
					<Pip on={outs >= 2} className={"o"}/>
					<Pip on={outs >= 3} className={"o"}/>
				</div>
			</div>
			<List>
				<HalfInning
					isLive
					halfInning={halfInning}
					defaultOpen={true}
					isCurrentHalfInning={true}
				/>
			</List>
		</div>
	);
}

const Pip: React.FC<{ on: boolean, className: string }> = ({on, className}) =>
{
	return (
		<span className={classNames(liveStyles.pip, liveStyles[className], {[liveStyles.on]: on})}/>
	);
};