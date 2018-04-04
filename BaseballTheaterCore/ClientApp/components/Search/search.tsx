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

interface ISearchProps
{
	query: string;
}

export class Search extends React.Component<RouteComponentProps<ISearchProps>, ISearchState>
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

	public static getQuery()
	{
		const matches = this.regex.exec(location.pathname);
		const query = matches != null && matches.length > 0
			? matches[1]
			: "";

		return decodeURI(query);
	}

	private updateHighlights(highlights: IHighlightSearchResult[] | null)
	{
		App.stopLoading();

		const setTo = highlights === null
			? [] as IHighlightSearchResult[]
			: [...this.state.highlights, ...highlights];

		this.setState({
			highlights: setTo
		});
	}

	public loadNextHighlightPage()
	{
		App.startLoading();

		fetch(`http://search.baseball.theater/api/Search/Highlights/?query=${this.state.query}&page=${this.nextPage}&perpage=${this.PER_PAGE}`)
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