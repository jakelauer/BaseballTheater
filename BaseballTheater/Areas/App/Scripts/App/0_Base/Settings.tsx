namespace Theater
{
	export class Settings extends React.Component<any, any>
	{
		private showSettings()
		{
		}

		public render()
		{
			return (<i onClick={() => this.showSettings()} className="material-icons">settings</i>);
		}
	}
}