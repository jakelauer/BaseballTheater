namespace Theater
{
	interface ISearchState
	{
		query: string;
		highlights: IHighlightSearchResult[];
	}

	export class Search extends React.Component<any, ISearchState>
	{
		public static readonly regex = /^\/search\/(.*)(\/|\?)?/i;
		private readonly PER_PAGE = 20;
		private nextPage = 0;

		constructor(props: any)
		{
			super(props);

			this.state = {
				query: Search.getQuery(),
				highlights: []
			}
		}

		public componentDidMount()
		{
			this.loadNextHighlightPage();

			Utility.LinkHandler.Instance.stateChangeDistributor.subscribe(() =>
			{
				if (Search.getQuery().trim() !== "")
				{
					this.setQuery();
					this.updateHighlights(null);
					this.loadNextHighlightPage();
				}
			});
		}

		private setQuery()
		{
			this.nextPage = 0;

			this.setState({
				query: Search.getQuery()
			});
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

			$.ajax({
				url: `/Data/SearchHighlights/?query=${this.state.query}&page=${this.nextPage}&perpage=${this.PER_PAGE}`,
				dataType: "json",
				success: data => this.updateHighlights(data)
			});

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
			const highlightsRendered = this.state.highlights.map(searchResult => <Highlight key={searchResult.Highlight.id} renderDate={true} highlight={searchResult} />);

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

	App.Instance.addPage({
		page: <Search/>,
		matchingUrl: Search.regex,
		name: "game"
	});
}