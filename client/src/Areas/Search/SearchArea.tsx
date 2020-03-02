import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Grid, InputBase, Theme} from "@material-ui/core";
import {FiSearch} from "react-icons/all";
import styles from "./SearchArea.module.scss";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";
import {Highlight} from "../../UI/Highlight";
import {IHighlightSearchItem} from "baseball-theater-engine";
import {MlbClientDataFetcher} from "../../Global/Mlb/MlbClientDataFetcher";
import {RouteComponentProps, withRouter} from "react-router";
import {SiteRoutes} from "../../Global/Routes/Routes";
import Button from "@material-ui/core/Button";
import {ContainerProgress} from "../../UI/ContainerProgress";
import Typography from "@material-ui/core/Typography";

interface ISearchAreaParams
{
	query: string;
	gameIds: string;
}

interface ISearchAreaProps extends RouteComponentProps<ISearchAreaParams>
{
}

interface DefaultProps
{
}

type Props = ISearchAreaProps & DefaultProps;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: '4px 12px',
			display: 'flex',
			alignItems: 'center',
			width: 450,
			margin: "2rem"
		},
		input: {
			marginLeft: theme.spacing(1),
			flex: 1,
			width: "100%"
		},
	}),
);

const SearchArea: React.FC<Props> = (props) =>
{
	const classes = useStyles();
	const timerRef = useRef(0);

	const [text, setText] = useState(props.match.params.query ?? "");
	const [page, setPage] = useState(0);
	const [highlights, setHighlights] = useState<IHighlightSearchItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() =>
	{
		if (text?.length ?? 0 > 0)
		{
			doSearch(text, page, []);
		}
	}, []);

	const textUpdate = (newText: string) =>
	{
		setText(newText);

		if (newText.length > 2)
		{
			setPage(0);
			doSearch(newText, 0, []);
		}
		else
		{
			setHighlights([]);
			setHasMore(false);
		}
	};

	const updatePage = () =>
	{
		const newPage = page + 1;
		setPage(newPage);
		doSearch(text, newPage, highlights);
	};

	const doSearch = (newText: string, newPage: number, lastHighlights: IHighlightSearchItem[]) =>
	{
		setIsLoading(true);
		clearTimeout(timerRef.current);
		timerRef.current = window.setTimeout(() =>
		{
			MlbClientDataFetcher.videoLocalSearch(newText, newPage, props.match.params.gameIds).then((data: IHighlightSearchItem[]) =>
			{
				if (data.length <= 0)
				{
					setHasMore(false);
				}
				if (data.length >= 20)
				{
					setHasMore(true);
				}

				setHighlights([...lastHighlights, ...data]);

				setIsLoading(false);
			});

			history.replaceState(null, null, SiteRoutes.Search.resolve({query: newText, gameIds: props.match.params.gameIds}));

		}, 500);
	};

	const highlightsRendered = highlights.map(item => (
		<Grid key={item.highlight.guid} item xs={12} sm={12} md={6} lg={4} xl={3}>
			<Highlight media={item?.highlight} className={styles.highlight} showExtra={true}/>
		</Grid>
	));

	return (
		<div className={styles.wrapper} style={{marginTop: props.match.params.gameIds ? "2rem" : "0"}}>
			{!props.match.params.gameIds && (
				<div className={styles.boxWrapper}>
					<Paper className={classes.root + " " + styles.paper}>
						<Grid container spacing={1} alignItems="flex-end" style={{width: "100%", display: "flex", alignItems: "center"}}>
							<Grid item>
								<FiSearch style={{fontSize: "1.25rem"}}/>
							</Grid>
							<Grid item style={{flex: "1 0"}}>
								<InputBase
									autoFocus
									value={text}
									onChange={(e) => textUpdate(e.currentTarget.value)}
									className={classes.input}
									placeholder="Search Highlights"
									inputProps={{'aria-label': 'search google maps'}}
								/>
							</Grid>
						</Grid>
					</Paper>
				</div>
			)}
			<Grid container className={styles.rest} spacing={3} style={{paddingLeft: 0, marginBottom: "2rem"}}>
				{highlightsRendered}
			</Grid>
			{highlights.length > 0 && highlights.length % 20 === 0 && (
				<div style={{display: "flex", justifyContent: "center", paddingBottom: "4rem"}}>
					{!isLoading && hasMore && (
						<Button onClick={updatePage} variant={"contained"} color={"primary"}>
							Load More
						</Button>
					)}
				</div>
			)}
			{isLoading && (
				<ContainerProgress/>
			)}

			{!isLoading && highlights.length === 0 && text.length >= 3 && (
				<Typography>No Highlights Found</Typography>
			)}
		</div>
	);
};

export default withRouter(SearchArea);