import { Grid } from '@material-ui/core';
import { MediaItem, RecapTags } from 'baseball-theater-engine';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MlbClientDataFetcher } from '../../Global/Mlb/MlbClientDataFetcher';
import { Highlight } from '../../UI/Highlight';
import { StringUtils } from '../../Utility/StringUtils';
import highlightStyles from '../Game/Highlights.module.scss';
import styles from './FeaturedVideoPage.module.scss';

type IFeaturedVideoPageParams = {
	tag: string;
}

interface IFeaturedVideoPageState {
	videos: MediaItem[];
	loading: boolean;
}

export const FeaturedVideoPage: React.FC = () => {
	const params = useParams<IFeaturedVideoPageParams>();
	const [videos, setVideos] = useState<MediaItem[]>();
	const [loading, setLoading] = useState(false);

	useEffect(() => loadVideos(), []);

	useEffect(() => {
		loadVideos();
	}, [params.tag]);

	const loadVideos = () => {
		setVideos([]);
		setLoading(true);

		const tagParam = params.tag || RecapTags.BestPerformer;
		const tagString = tagParam as keyof typeof RecapTags;
		const tag = RecapTags[tagString];

		MlbClientDataFetcher.videoTagSearch(tag)
			.then(videos => {
				setVideos(videos);
				setLoading(false);
			});
	}

	const tag = params.tag;
	const title = StringUtils.splitCamelCaseToString(tag);

	const videosOrSkeleton = videos.length ? videos : Array(20).fill(0);

	const videosRendered = videosOrSkeleton.map(v => (
		<Grid item xs={12} sm={6} lg={4} xl={3}>
			<Highlight media={v.video} loading={loading} />
		</Grid>
	));

	return (
		<div className={styles.wrapper}>
			<h2>{title}</h2>
			<Grid container className={highlightStyles.rest} spacing={3}>
				{videosRendered}
			</Grid>
		</div>
	);
}
