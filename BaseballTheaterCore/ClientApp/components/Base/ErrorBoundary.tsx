import { RouteComponentProps, withRouter } from "react-router";
import { Alert, Row, Col } from "antd";
import * as React from "react";
import Config, { Environments } from "../Config/config";

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
			const desc = <Row>
				<Col span={12}>
					<div>
						Uh oh, something went wrong! If you see this, please email a screenshot to baseball.theater@gmail.com.
						<br />
						<br />
						<h2>Info:</h2>
					</div>
					<pre style={{ whiteSpace: "pre-wrap" }}>
						URL: {location.href}<br/>
						Timestamp: {(new Date()).toISOString()}<br />
						Browser: {navigator.userAgent}<br />
						Platform: {navigator.platform}<br />

					</pre>
				</Col>
				{Config.Environment === Environments.Local &&
					<Col span={12}>
						{this.state.error.toString()}
						<pre style={{ whiteSpace: "pre-line" }}>
							{this.state.errorInfo.componentStack}
						</pre>
					</Col>
				}
			</Row>;

			return <React.Fragment>
				<Alert
					message="Error"
					description={desc}
					type="error"
					showIcon
				/>
			</React.Fragment>;
		}

		return this.props.children;
	}
}

export const ErrorBoundary = withRouter<{}>(ErrorBoundaryInternal);