import * as React from "react";
import {RouteComponentProps} from "react-router";
import {RecapTags, VideoSearchWithMetadata} from "baseball-theater-engine";
import {MlbClientDataFetcher} from "../../Global/Mlb/MlbClientDataFetcher";
import {StringUtils} from "../../Utility/StringUtils";
import {Grid} from "@material-ui/core";
import {Highlight} from "../../UI/Highlight";
import Skeleton from '@material-ui/lab/Skeleton';
import highlightStyles	from "../Game/Highlights.module.scss";
import styles from "./FeaturedVideoPage.module.scss";

interface IFeaturedVideoPageParams
{
	tag: string;
}

interface IFeaturedVideoPageProps extends RouteComponentProps<IFeaturedVideoPageParams>
{
}

type Props = IFeaturedVideoPageProps;
type State = IFeaturedVideoPageState;

interface IFeaturedVideoPageState
{
	videos: VideoSearchWithMetadata[];
	loading: boolean;
}

export class FeaturedVideoPage extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			videos: [],
			loading: false
		};
	}

	public componentDidMount(): void
	{
		this.loadVideos();
	}

	public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void
	{
		if (prevProps.match.params.tag !== this.props.match.params.tag)
		{
			this.loadVideos();
		}
	}

	private loadVideos()
	{
		this.setState({
			videos: [],
			loading: true
		});

		const tagString = this.props.match.params.tag as keyof typeof RecapTags;
		const tag = RecapTags[tagString];
		MlbClientDataFetcher.videoTagSearch(tag)
			.then(videos =>
			{
				this.setState({
					videos,
					loading: false
				});
			});
	}

	public render()
	{
		const {videos, loading} = this.state;
		const tag = this.props.match.params.tag;
		const title = StringUtils.splitCamelCaseToString(tag);

		const videosOrSkeleton = videos.length ? videos : Array(20).fill(0);

		const videosRendered = videosOrSkeleton.map(v => (
			<Grid item xs={12} sm={6} lg={4} xl={3}>
				<Highlight media={v.video} loading={loading}/>
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
}