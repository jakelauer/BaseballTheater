import * as React from "react";
import RespondIntercom, {RespondSizes} from "./RespondIntercom";

interface IRespondProps
{
	at: RespondSizes;
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
		RespondIntercom.listen(data => this.setState({
			current: data.sizes
		}));
	}

	public render()
	{
		const {
			at,
			hide,
			children
		} = this.props;

		const shouldShow = (!hide && this.state.current.indexOf(at) > -1)
			|| (hide && this.state.current.indexOf(at) === -1);

		return shouldShow ? children : null;

	}
}