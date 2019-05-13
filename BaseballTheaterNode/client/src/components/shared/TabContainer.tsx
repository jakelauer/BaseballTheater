import * as React from "react";
import { GameDetailTabs } from "../GameDetail/GameDetail";
import Config from "../Config/config";
import { Link, Redirect, withRouter, RouteComponentProps } from "react-router-dom";

export interface ITabContainerTab {
    key: string;
    label: string;
    link: string;
    render: () => React.ReactNode;
}

interface ITabContainerProps extends RouteComponentProps {
    tabs: ITabContainerTab[];
    defaultActiveTab?: string;
}

interface ITabContainerState {
}

class TabContainerInternal extends React.Component<ITabContainerProps, ITabContainerState>
{
    constructor(props: ITabContainerProps) {
        super(props);

        this.state = {
        };
    }

    private isActive(tab: ITabContainerTab) {
        return tab.link === location.pathname || tab.link === this.props.defaultActiveTab;
    }

    public componentWillReceiveProps(nextProps: ITabContainerProps) {
        const defaultActiveTab = this.getTabKey(nextProps);

        this.setState({
            defaultActiveTab
        });
    }

    private getTabKey(props: ITabContainerProps) {
        let activeTabKey = props.defaultActiveTab;
        if (activeTabKey === undefined) {
            activeTabKey = props.tabs.length > 0
                ? props.tabs[0].key
                : null;
        }
        
        return activeTabKey;
    }

    private renderCurrentTabContent() {
        const currentTab = this.props.tabs.find(a => this.isActive(a));
        return currentTab.render();
    }

    private renderTab(tab: ITabContainerTab) {
        const isActiveClass = this.isActive(tab)
            ? "on"
            : "";

        return (
            <Link to={tab.link} key={tab.key} className={`tab ${isActiveClass}`}>
                <span>{tab.label}</span>
            </Link>
        );
    }

    public render() {
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

export const TabContainer = withRouter(TabContainerInternal);