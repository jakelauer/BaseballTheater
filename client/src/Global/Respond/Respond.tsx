import * as React from "react";
import {RespondDataStore, RespondSizes} from "./RespondDataStore";

interface IRespondProps
{
	at: RespondSizes;
	ignoreIfUnmatched?: boolean;
}

interface DefaultProps
{
	hide: boolean;
}

type Props = IRespondProps & DefaultProps;

interface IRespondState
{
	current: RespondSizes[];
}

export class Respond extends React.Component<Props, IRespondState>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			current: []
		};
	}

	public static defaultProps: DefaultProps = {
		hide: false
	};

	public componentDidMount()
	{
		RespondDataStore.listen(data => this.setState({
			current: data.sizes
		}));
	}

	public render()
	{
		const {
			at,
			hide,
			ignoreIfUnmatched,
			children
		} = this.props;

		const matchedAt = this.state.current.indexOf(at) > -1;

		const shouldShow = (!matchedAt && ignoreIfUnmatched)
			|| (!hide && matchedAt)
			|| (hide && !matchedAt);

		return shouldShow
			? children
			: null;

	}
}