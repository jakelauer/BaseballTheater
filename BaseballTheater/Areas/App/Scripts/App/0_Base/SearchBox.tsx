namespace Theater
{
	export class SearchBox extends React.Component<any, any>
	{
		private timer: number = 0;

		private onKeyup(e: React.KeyboardEvent<HTMLInputElement>)
		{
			clearTimeout(this.timer);

			const value = (e.target as HTMLInputElement).value;
			this.timer = setTimeout(() => this.performSearch(value), 500);
		}

		private performSearch(query: string)
		{
			Utility.LinkHandler.pushState(`/Search/${encodeURI(query)}`);
		}

		public render()
		{
			const value = Search.getQuery();

			return (
				<div className={`search`}>
					<input type="text" required onKeyUp={e => this.onKeyup(e)} defaultValue={value} />
					<div className={`label`}>
						<i className={`material-icons`}>search</i> <span>Find games &amp; highlights</span>
					</div>
				</div>
			);
		}
	}
}