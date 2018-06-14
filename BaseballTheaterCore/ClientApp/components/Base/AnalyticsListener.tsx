import {RouteComponentProps, withRouter} from "react-router";
import * as React from "react";
import * as ReactGA from "react-ga";

class InnerAnalyticsListener extends React.Component<RouteComponentProps<{}>, {}>
{
	public componentDidMount()
	{
		InnerAnalyticsListener.sendPageView(this.props.history.location);
		this.props.history.listen(InnerAnalyticsListener.sendPageView);
	}

	private static sendPageView(location)
	{
		ReactGA.set({page: location.pathname});
		ReactGA.pageview(location.pathname);
	}

	public render()
	{
		return this.props.children;
	}
}

export const AnalyticsListener = withRouter<{}>(InnerAnalyticsListener);