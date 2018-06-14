import {RouteComponentProps, withRouter} from "react-router";
import {Alert, Collapse} from "antd";
import * as React from "react";

interface IErrorBoundaryState
{
	hasError: boolean;
	error: Error;
	errorInfo: React.ErrorInfo;
}

/** This class exists to handle error cases more gracefully than having the app just disappear.
 *  * If a child component errors out, it will display a message with error details */
class ErrorBoundaryInternal extends React.Component<RouteComponentProps<{}>, IErrorBoundaryState>
{
	constructor(props: RouteComponentProps<{}>)
	{
		super(props);

		this.state = {
			hasError: false,
			error: null,
			errorInfo: null
		};
	}

	public componentDidCatch(error: Error, errorInfo: React.ErrorInfo)
	{
		this.setState({ hasError: true, error, errorInfo });

		console.error(error, errorInfo);

		// When the error shows up, we still want people to be able to navigate after it.
		// So, we will listen to one history change and remove the error state at that point.
		const unregisterCallback = this.props.history.listen((location) =>
		{
			unregisterCallback();

			this.setState({
				hasError: false,
				error: null,
				errorInfo: null
			});
		});
	}

	public render()
	{
		if (this.state.hasError)
		{
			return <React.Fragment>
				<Alert
					message="Error"
					description="Uh oh, something went wrong! If you see this, please email a screenshot to baseball.theater@gmail.com"
					type="error"
					showIcon
				/>
				<Collapse defaultActiveKey={["0"]}>
					<Collapse.Panel key="0" header={`Show error details`}>
						{this.state.error.toString()}
						<br /><br />
						<pre style={{ whiteSpace: "pre-line" }}>
							{this.state.errorInfo.componentStack}
						</pre>
					</Collapse.Panel>
				</Collapse>
			</React.Fragment>;
		}

		return this.props.children;
	}
}

export const ErrorBoundary = withRouter<{}>(ErrorBoundaryInternal);