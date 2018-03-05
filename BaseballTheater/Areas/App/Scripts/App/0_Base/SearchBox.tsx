namespace Theater
{
	interface ISearchBoxState
	{
		currentValue: string;
	}

	export class SearchBox extends React.Component<any, ISearchBoxState>
	{
		private timer: number = 0;

		constructor(props: any)
		{
			super(props);

			this.state = {
				currentValue: Search.getQuery()
			}
		}

		private onChange(e: React.ChangeEvent<HTMLInputElement>)
		{
			clearTimeout(this.timer);

			const value = (e.target as HTMLInputElement).value;
			this.setState({
				currentValue: value
			});
			this.timer = setTimeout(() => this.performSearch(value), 500);
		}

		public componentDidMount()
		{
			if (Utility.LinkHandler.Instance.stateChangeDistributor)
			{
				Utility.LinkHandler.Instance.stateChangeDistributor.subscribe(() =>
				{
					if (!location.pathname.match(Search.regex))
					{
						this.setState({
							currentValue: ""
						});
					}
				});
			}
		}

		private performSearch(query: string)
		{
			Utility.LinkHandler.pushState(`/Search/${encodeURI(query)}`);
		}

		public render()
		{
			return (
				<div className={`search`}>
					<input type="text" required onChange={e => this.onChange(e)} value={this.state.currentValue} />
					<div className={`label`}>
						<i className={`material-icons`}>search</i> <span>Find games &amp; highlights</span>
					</div>
				</div>
			);
		}
	}
}