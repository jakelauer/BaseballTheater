import { CircularProgress, Grid } from '@material-ui/core';
import { useDataStore } from 'Global/Intercom/DataStore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MediaItem } from '../../../../baseball-theater-engine/contract';
import { AuthDataStore, BackerType, IAuthContext } from '../../Global/AuthDataStore';
import { ChromecastFab } from '../../UI/ChromecastFab';
import { ContainerProgress } from '../../UI/ContainerProgress';
import { Highlight } from '../../UI/Highlight';
import styles from './TeamHighlights.module.scss';

interface ITeamHighlightsState {
	videos: MediaItem[];
	page: number;
	loading: boolean;
	authContext: IAuthContext;
}

const TeamHighlights: React.FC = () => {
	const params = useParams<{ teamFileCode: string }>();

	const [videos, setVideos] = useState<MediaItem[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const authContext = useDataStore(AuthDataStore);

	useEffect(() => {
		loadNextPage();

		window.addEventListener("scroll", () => {
			const scrollMax = document.body.scrollHeight - window.innerHeight;
			const scroll = window.scrollY;
			if (scrollMax - scroll < 50 && !loading) {
				setLoading(true);
				setPage(page + 1);
			}
		});
	}, []);

	useEffect(() => {
		setPage(1);
		setVideos([]);
		setLoading(true);
		loadNextPage();
	}, [params.teamFileCode]);

	useEffect(() => {
		loadNextPage();
	}, [page])

	const loadNextPage = () => {
		fetch(`/api/team?page=${page}&team=${params.teamFileCode}`, {
			headers: {
				"x-app": "baseballtheater",
				"x-api-key": "78AF1CF0-6D5F-4360-83BA-7AF7599EF107"
			}
		})
			.then(r => r.json())
			.then((data: MediaItem[]) => {

				setVideos([...videos, ...data]);
				setLoading(false);
			});
	}

	if (!AuthDataStore.hasLevel(BackerType.ProBacker)) {
		return <>{"Requires Pro Backer"}</>;
	}

	return (
		<div className={styles.wrapper}>
			<Grid container className={styles.rest} spacing={3} style={{ paddingLeft: 0, marginBottom: "2rem" }}>
				{videos.map(video => (
					<Grid key={video.guid} item xs={12} sm={12} md={6} lg={4} xl={3}>
						<Highlight media={video} className={styles.highlight} />
					</Grid>
				))}
			</Grid>
			{videos.length === 0 && <ContainerProgress />}
			{loading && videos.length !== 0 && <CircularProgress />}
			<ChromecastFab />
		</div>
	);
}


export default TeamHighlights;