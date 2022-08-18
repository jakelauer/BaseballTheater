import { Grid } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment/moment';
import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { useParams } from 'react-router';

import { ContainerProgress } from '../../UI/ContainerProgress';
import { GqlSearchHighlight } from '../../UI/GqlSearchHighlight';
import { NewSearchQuery, QueryType } from './__generated__/NewSearchQuery.graphql';
import { ISearchAreaParams } from './SearchArea';
import styles from './SearchArea.module.scss';

export type GqlSearchMediaPlayback = NewSearchQuery["response"]["search"]["plays"][0]["mediaPlayback"][0]["feeds"][0]["playbacks"]
export type GqlMediaCut = NewSearchQuery["response"]["search"]["plays"][0]["mediaPlayback"][0]["feeds"][0]["image"]["cuts"]

const getImage = (images: GqlMediaCut) =>
{
	return images.find(a => a.aspectRatio === "16:9" && a.width < 1000 && a.width > 500)?.src
		|| images.find(a => a.aspectRatio === "16:9")?.src
		|| images[0]?.src;
}

const useStyles = makeStyles(() => ({
	paginator: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		margin: "1rem auto",
		background: "transparent !important"
	}
}));

interface NewSearchProps
{
	prepopulated?: { date: string; tag: string; };
	query?: string;
}

export const NewSearch: React.FC<NewSearchProps> = (props) =>
{
	const params = useParams<ISearchAreaParams>();

	const {
		tag,
		date
	} = props.prepopulated ?? {};

	let startingQuery = null;

	if (tag && date)
	{
		const realDate = moment(decodeURIComponent(date)).format("YYYY-MM-DD");
		startingQuery = `ContentTags = ["${tag}"] AND Date = ["${realDate}"] Order By Timestamp DESC`;
	}

	const query = startingQuery ?? props.query;

	const queryType = !!props.prepopulated ? "STRUCTURED" : "FREETEXT";

	return (
		<>
			<Helmet>
				<title>{`Search: ${params.query ?? query}`}</title>
			</Helmet>

			<React.Suspense fallback={<ContainerProgress/>}>
				<Searcher query={query} queryType={queryType}/>
			</React.Suspense>
		</>
	);
}

export const Searcher = (props: {
	query: string,
	queryType: QueryType,
	onUpdate?: (results: any) => void
}) =>
{
	const {
		query,
		queryType,
		onUpdate
	} = props;

	const classes = useStyles();

	const [page, setPage] = useState(0);

	const data = useLazyLoadQuery<NewSearchQuery>(graphql`
        query NewSearchQuery($queryType: QueryType!, $query: String!, $page: Int, $limit: Int, $feedPreference: FeedPreference, $languagePreference: LanguagePreference, $contentPreference: ContentPreference) {
            search(queryType: $queryType, languagePreference: $languagePreference, contentPreference: $contentPreference, feedPreference: $feedPreference, limit: $limit, page: $page, query: $query) {
                total
                plays{
                    gameDate
                    id
					gamePk
					ga
                    mediaPlayback {
                        id
                        slug
                        blurb
                        date
                        description
                        title
                        canAddToReel
                        feeds {
                            type
                            duration
                            image {
                                altText
                                templateUrl
                                cuts {
                                    width
                                    src
                                    aspectRatio
                                }
                            }
                            playbacks {
                                name
                                segments
                                url
                            }
                        }
                    }
                }
            }
        }
	`, {
		queryType,
		query, 
		limit: 36,
		page,
		languagePreference: "EN",
		contentPreference: "MIXED"
	});

	const maxPages = Math.ceil((data?.search?.total ?? 0) / 36);

	useEffect(() => {
		onUpdate?.(data);
	}, [data, onUpdate])

	return (
		<>
			{maxPages > 1 && (
				<Pagination
					page={page + 1}
					color="secondary"
					className={classes.paginator}
					onChange={(e, pageNum) => setPage(pageNum - 1)}
					hideNextButton={maxPages <= page}
					count={maxPages}
				/>
			)}

			<Grid container className={styles.rest} spacing={3} style={{paddingLeft: 0, marginBottom: "2rem"}}>
				{data?.search?.plays?.map(play => (
					<Grid key={play.id} item xs={12} sm={12} md={6} lg={4} xl={3}>
						<GqlSearchHighlight
							gamePk={play.gamePk}
							imageSrc={getImage(play.mediaPlayback[0].feeds[0].image.cuts)}
							imageAlt={play.mediaPlayback[0].feeds[0].image.altText}
							mediaDate={play.gameDate}
							mediaDescription={play.mediaPlayback[0].description}
							mediaTitle={play.mediaPlayback[0].title}
							videos={play.mediaPlayback[0].feeds[0].playbacks}
						/>
					</Grid>
				))}
			</Grid>

			{maxPages > 1 && (
				<Pagination
					page={page + 1}
					color="secondary"
					className={classes.paginator}
					onChange={(e, pageNum) => setPage(pageNum - 1)}
					hideNextButton={maxPages <= page}
					count={maxPages}
				/>
			)}
		</>
	);
}