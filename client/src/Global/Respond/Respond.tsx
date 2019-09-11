import * as React from "react";

export enum RespondSizes
{
	pico = 320,
	tiny = 600,
	small = 800,
	medium = 1000,
	large = 1200,
	huge = 1600,
	hd = 1920
}

type RespondSizesKeys = keyof typeof RespondSizes;

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

		this.determineSize = this.determineSize.bind(this);
	}

	public static defaultProps: DefaultProps = {
		hide: false
	};

	public componentDidMount()
	{
		this.determineSize();

		window.addEventListener("resize", this.determineSize);
	}

	public componentWillUnmount(): void
	{
		window.removeEventListener("resize", this.determineSize);
	}

	private determineSize()
	{
		const sizeKeyStrings = Object.keys(RespondSizes).filter(a => isNaN(parseInt(a))) as RespondSizesKeys[];
		const current = sizeKeyStrings.filter(key =>
		{
			const pxWidth = RespondSizes[key];
			return matchMedia(`(max-width: ${pxWidth}px)`).matches;
		}).map(key => RespondSizes[key]);


		this.setState({
			current
		});
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