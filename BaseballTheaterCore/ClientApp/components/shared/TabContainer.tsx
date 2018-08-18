import * as React from "react";
import {GameDetailTabs} from "../GameDetail/GameDetail";
import Config from "../Config/config";
import {Link} from "react-router-dom";

export interface ITabContainerTab
{
	key: string;
	label: string;
	link: string;
	render: () => React.ReactNode;
}

interface ITabContainerProps
{
	tabs: ITabContainerTab[];
	defaultActiveTabKey?: string;
}

interface ITabContainerState
{
	activeTabKey: string;
}

export class TabContainer extends React.Component<ITabContainerProps, ITabContainerState>
{
	constructor(props: ITabContainerProps)
	{
		super(props);

		const activeTabKey = this.getTabKey(props);

		this.state = {
			activeTabKey
		};
	}

	private setTabState(tab: ITabContainerTab)
	{
		this.setState({
			activeTabKey: tab.key
		});
	}

	public componentWillReceiveProps(nextProps: ITabContainerProps)
	{
		const activeTabKey = this.getTabKey(nextProps);
		
		this.setState({
			activeTabKey
		});
	}

	private getTabKey(props: ITabContainerProps)
	{
		let activeTabKey = props.defaultActiveTabKey;
		if (activeTabKey === undefined)
		{
			activeTabKey = props.tabs.length > 0 ? props.tabs[0].key : null;
		}

		return activeTabKey;
	}

	private renderCurrentTabContent()
	{
		const currentTab = this.props.tabs.find(a => a.key === this.state.activeTabKey);
		return currentTab.render();
	}

	private renderTab(tab: ITabContainerTab)
	{
		const isActiveClass = tab.key === this.state.activeTabKey
			? "on"
			: "";

		return (
			<Link to={tab.link} key={tab.key} className={`tab ${isActiveClass}`} onClick={() => this.setTabState(tab)}>
				<span>{tab.label}</span>
			</Link>
		);
	}

	public render()
	{
		const tabsRendered = this.props.tabs.map(tab => this.renderTab(tab));

		return (
			<div className={`tab-container-wrapper`}>
				<div className={`tabs`}>
					<div className={`tab-container`}>
						{this.props.children}
						{tabsRendered}
					</div>
				</div>
				<div className={`tab-contents`}>
					{this.renderCurrentTabContent()}
				</div>
			</div>
		);
	}
}