import * as React from "react";

interface IScoreboardItemProps
{
}

interface DefaultProps
{
}

type Props = IScoreboardItemProps & DefaultProps;

interface IScoreboardItemState
{
}

export class ScoreboardItem extends React.Component<Props, IScoreboardItemState>
{
	constructor(props: Props)
	{
		super(props);
	}

	public render()
	{
		return (
			<span/>
		);
	}
}