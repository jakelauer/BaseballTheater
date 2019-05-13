import * as React from "react";
import {Icon} from "antd";
import * as ReactDOM from "react-dom";

export interface IMenuItemProps
{
	label: React.ReactNode;
}

interface IMenuItemState
{
	active: boolean;
}

export class MenuItem extends React.Component<IMenuItemProps, IMenuItemState>
{
	constructor(props: IMenuItemProps)
	{
		super(props);

		this.state = {
			active: false
		};
	}

	private setActive(active: boolean)
	{
		this.setState({active});
	}

	public componentWillMount()
	{
		document.addEventListener("touchstart", this.handleOutsideTouch, false);
	}

	public componentWillUnmount()
	{
		document.removeEventListener("touchstart", this.handleOutsideTouch, false);
	}

	private handleOutsideTouch = (event: MouseEvent) => {
		const node = ReactDOM.findDOMNode(this);
		if (node.contains(event.target as Node))
		{
			return;
		}
		
		this.setActive(false);
	};

	public render()
	{
		const activeClass = this.state.active
			? "active"
			: "";

		return (
			<div className={`menu-item ${activeClass}`}
				 onMouseOver={() => this.setActive(true)}
				 onMouseOut={() => this.setActive(false)}
				 onTouchEnd={() => this.setActive(true)}
			>
				<div className={`label`}>{this.props.label} <Icon type="down"/></div>
				<div className={`sub-menu`}>
					{this.props.children}
				</div>
			</div>
		);
	}
}