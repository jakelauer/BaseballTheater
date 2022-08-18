import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { Alert } from '@material-ui/lab';
import { GameMedia, LiveData } from 'baseball-theater-engine';
import moment from 'moment';
import { useState } from 'react';
import Helmet from 'react-helmet';

import { ChromecastFab } from '../../UI/ChromecastFab';
import { ContainerProgress } from '../../UI/ContainerProgress';
import { Highlight } from '../../UI/Highlight';
import { Searcher } from '../Search/NewSearch';
import styles from './Highlights.module.scss';

interface IHighlightsProps {
	gamePk: string;
	media: GameMedia;
	liveData: LiveData;
}

export const Highlights: React.FC<IHighlightsProps> = ({
	gamePk,
	media,
	liveData
}) => {
	const getHighlights = () => {
		return media
			&& media.highlights
			&& media.highlights.highlights
			&& media.highlights.highlights.items
			|| [];
	}

	const [hasGqlResults, setHasGqlResults] = useState(false);
	const onGqlUpdate = (results: any) => setHasGqlResults(results.search.total >= 1);

	if (!liveData?.gameData) {
		return <ContainerProgress />;
	}

	const highlights = getHighlights();
	const recap = highlights.find(a => a.keywordsAll.some(a => a.value.toLocaleLowerCase().includes("recap")));
	const condensed = highlights.find(a => a.keywordsAll.some(a => a.value.toLocaleLowerCase().includes("condensed")));
	const rest = highlights.filter(a => a !== condensed && a !== recap && a.image !== undefined);
	rest.sort((a, b) => {
		const aDate = moment(a.date);
		const bDate = moment(b.date);

		return bDate.isBefore(aDate) ? 1 : -1;
	});

	const videosOrSkeleton = rest.length
		? rest
		: Array(20).fill(0);

	const restRendered = videosOrSkeleton.map(item => (
		<Grid key={item.guid} item xs={12} sm={12} md={6} lg={4} xl={3}>
			<Highlight media={item} className={styles.highlight} />
		</Grid>
	));

	const teams = liveData.gameData.teams;
	const date = moment(liveData.gameData.datetime.dateTime).format("MMMM D, YYYY");

	const textQuery = `${liveData.gameData.datetime.originalDate} ${teams.away.name} ${teams.home.name}`

	return (
		<div className={styles.wrapper}>
			<Helmet>
				<title>{`Highlights - ${teams.away.teamName} @ ${teams.home.teamName}, ${date}`}</title>
			</Helmet>

			{!recap && !condensed && !rest.length && !hasGqlResults && !!media && (
				<>
					<Searcher onUpdate={onGqlUpdate} queryType={'FREETEXT'} query={`${textQuery} recap`} />
					<Searcher onUpdate={onGqlUpdate} queryType={'FREETEXT'} query={`${textQuery} condensed`} />
					<Searcher onUpdate={onGqlUpdate} queryType={'FREETEXT'} query={`${textQuery} highlights`} />
				</>
			)}
			{!recap && !condensed && !rest.length && !hasGqlResults && !!liveData.gameData && (
				<Alert severity={"error"}>
					This game has no videos available yet.
				</Alert>
			)}
			{(recap || condensed) && (
				<>
					<Grid container className={styles.rest} spacing={3} style={{ paddingLeft: 0, marginBottom: "2rem" }}>
						{recap && recap.image &&
							<Grid item lg={4} xs={12} sm={12} md={6}>
								<Highlight media={recap} className={styles.highlight} />
							</Grid>
						}
						{condensed && condensed.image &&
							<Grid item lg={4} xs={12} sm={12} md={6}>
								<Highlight media={condensed} className={styles.highlight} />
							</Grid>
						}
					</Grid>
					<Divider style={{ marginBottom: "2rem" }} />
				</>
			)}
			<Grid container className={styles.rest} spacing={3} style={{ paddingLeft: 0 }}>
				{restRendered}
				{!media && <ContainerProgress />}
			</Grid>
			<ChromecastFab />
		</div>
	);
}
