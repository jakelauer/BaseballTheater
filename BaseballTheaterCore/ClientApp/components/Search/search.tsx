import React = require("react");
import * as moment from "moment";
import {RouteComponentProps} from "react-router";
import {App} from "../Base/app";
import {Highlight} from "../shared/highlight";

interface ISearchState
{
	gameIds: string[];
	query: string;
	highlights: MediaItem[];
}

interface ISearchRouteParams
{
	gameIds: string;
	query: string;
}

export class Search extends React.Component<RouteComponentProps<ISearchRouteParams>, ISearchState>
{
	public static readonly regex = /^\/search\/(.*)(\/|\?)?/i;
	private readonly PER_PAGE = 20;
	private nextPage = 0;

	constructor(props: any)
	{
		super(props);

		this.state = {
			gameIds: this.props.match.params.gameIds ? this.props.match.params.gameIds.split(",") : [],
			query: this.props.match.params.query,
			highlights: []
		}
	}

	public componentDidMount()
	{
		this.loadNextHighlightPage();
	}

	public componentWillUpdate(nextProps: Readonly<RouteComponentProps<ISearchRouteParams>>)
	{
		const params = this.props.match.params;
		const nextParams = nextProps.match.params;
		
		if (params.query !== nextParams.query
		|| params.gameIds !== nextParams.gameIds)
		{
			this.reset(nextParams.query, nextParams.gameIds);
		}
	}

	public static getQuery()
	{
		const matches = this.regex.exec(location.pathname);
		const query = matches != null && matches.length > 0
			? matches[1].split("/")[0]
			: "";

		return decodeURI(query);
	}

	private updateHighlights(highlights: MediaItem[] | null, callback = () => {})
	{
		App.stopLoading();

		const setTo = highlights === null
			? [] as MediaItem[]
			: [...this.state.highlights, ...highlights];

		this.setState({
			highlights: setTo
		}, callback);
	}

	private reset(newQuery: string, newGameIds: string)
	{
		this.updateHighlights(null, () => {
			this.nextPage = 0;
			this.setState({
				query: newQuery,
				gameIds: newGameIds ? newGameIds.split(",") : []
			}, () => this.loadNextHighlightPage());
		});
	}

	public loadNextHighlightPage()
	{
		App.startLoading();

		const gameIdsQuery = this.state.gameIds.length > 0 ? `&gameIds=${this.state.gameIds.join(",")}` : "";
		
		fetch(`https://search.baseball.theater/api/Search/Highlights/?query=${this.state.query}&page=${this.nextPage}&perpage=${this.PER_PAGE}${gameIdsQuery}`)
			.then((response: Response) => response.json())
			.then(json => this.updateHighlights(json));

		this.nextPage++;
	}

	private renderLoadMoreButton()
	{
		return (
			<div className={`load-more-container`}>
				<div className={`load-more button`} onClick={() => this.loadNextHighlightPage()}>Load More</div>
			</div>
		);
	}

	public render()
	{
		const highlightsRendered = this.state.highlights.map(searchResult =>
			<Highlight hideScores={false} key={searchResult.guid} renderDate={true} highlight={searchResult}/>);

		const shouldShowLoadMore = this.state.highlights.length % this.PER_PAGE === 0
			&& this.state.highlights.length > 0
			&& !App.isLoading;

		const loadMoreButton = shouldShowLoadMore
			? this.renderLoadMoreButton()
			: null;

		document.title = `"${this.state.query}" Highlight Search - Baseball Theater`;

		return (
			<div className={`search-results highlights-container`}>
				{highlightsRendered.length > 0 &&
				<div className={`all-highlights`}>
					{highlightsRendered}
				</div>
				}
				{!highlightsRendered || highlightsRendered.length === 0 && !App.isLoading &&
					<h3 style={{textAlign: "center"}}>No highlights found for your search.</h3>
				}

				{loadMoreButton}
			</div>
		);
	}
}