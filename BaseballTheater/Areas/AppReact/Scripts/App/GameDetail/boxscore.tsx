namespace Theater
{
	interface IBoxScoreProps
	{
		boxScoreData: BoxScore;
	}

	export class BoxScoreReact extends React.Component<IBoxScoreProps, any>
	{
		public render()
		{
			return (<div/>);
		}
	}
}