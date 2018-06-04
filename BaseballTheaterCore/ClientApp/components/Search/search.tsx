import React = require("react");
import {RouteComponentProps} from "react-router";
import {IHighlightSearchResult} from "../../MlbDataServer/Contracts";
import {App} from "../Base/app";
import {Highlight} from "../shared/highlight";

interface ISearchState
{
	query: string;
	highlights: IHighlightSearchResult[];
}

interface ISearchRouteParams
{
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
		if (this.props.match.params.query !== nextProps.match.params.query)
		{
			this.reset(nextProps.match.params.query);
		}
	}

	public static getQuery()
	{
		const matches = this.regex.exec(location.pathname);
		const query = matches != null && matches.length > 0
			? matches[1]
			: "";

		return decodeURI(query);
	}

	private updateHighlights(highlights: IHighlightSearchResult[] | null, callback = () => {})
	{
		App.stopLoading();

		const setTo = highlights === null
			? [] as IHighlightSearchResult[]
			: [...this.state.highlights, ...highlights];

		this.setState({
			highlights: setTo
		}, callback);
	}

	private reset(newQuery: string)
	{
		this.updateHighlights(null, () => {
			this.nextPage = 0;
			this.setState({
				query: newQuery
			}, () => this.loadNextHighlightPage());
		});
	}

	public loadNextHighlightPage()
	{
		App.startLoading();

		fetch(`https://search.baseball.theater/api/Search/Highlights/?query=${this.state.query}&page=${this.nextPage}&perpage=${this.PER_PAGE}`)
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
			<Highlight hideScores={false} key={searchResult.highlight.id} renderDate={true} highlight={searchResult}/>);

		const shouldShowLoadMore = this.state.highlights.length % this.PER_PAGE === 0
			&& this.state.highlights.length > 0
			&& !App.isLoading;

		const loadMoreButton = shouldShowLoadMore
			? this.renderLoadMoreButton()
			: null;

		document.title = `"${this.state.query}" Highlight Search - Baseball Theater`;

		return (
			<div className={`search-results highlights-container`}>
				<div className={`all-highlights`}>
					{highlightsRendered}
				</div>

				{loadMoreButton}
			</div>
		);
	}
}