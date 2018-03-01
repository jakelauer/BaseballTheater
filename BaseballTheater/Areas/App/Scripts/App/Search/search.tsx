namespace Theater
{
	interface ISearchState
	{
		query: string;
		highlights: IHighlightSearchResult[];
	}

	export class Search extends React.Component<any, ISearchState>
	{
		private static readonly regex = /^\/search\/(.*)(\/|\?)?/i;

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
			this.loadData();

			Utility.LinkHandler.Instance.stateChangeDistributor.subscribe(() =>
			{
				if (Search.getQuery().trim() !== "")
				{
					this.setQuery();
					this.loadData();
				}
			});
		}

		private setQuery()
		{
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

		private updateHighlights(highlights: IHighlightSearchResult[])
		{
			App.stopLoading();
			this.setState({
				highlights
			});
		}

		public loadData()
		{
			App.startLoading();
			$.ajax({
				url: `/Data/SearchHighlights/?query=${this.state.query}&page=0&perpage=20`,
				dataType: "json",
				success: data => this.updateHighlights(data)
			});
		}

		public render()
		{
			const highlightsRendered = this.state.highlights.map(searchResult => <Highlight highlight={searchResult.Highlight} />);

			return (
				<div className={`search-results`}>
					{highlightsRendered}
				</div>
			);
		}
	}

	App.Instance.addPage({
		page: <Search/>,
		matchingUrl: /^\/search\/(.*)/gi,
		name: "game"
	});
}