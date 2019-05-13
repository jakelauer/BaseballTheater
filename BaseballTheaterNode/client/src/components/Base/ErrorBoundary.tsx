import {RouteComponentProps, withRouter} from "react-router";
import {Alert, Row, Col, Button} from "antd";
import * as React from "react";
import Config, {Environments} from "../Config/config";
import {Utility} from "@Utility/index";
import Responsive = Utility.Responsive;
import {App} from "./app";

interface IErrorBoundaryState
{
	hasError: boolean;
	error: Error;
	errorInfo: React.ErrorInfo;
}

/** This class exists to handle error cases more gracefully than having the app just disappear.
 *  * If a child component errors out, it will display a message with error details */
class ErrorBoundaryInternal extends React.Component<RouteComponentProps, IErrorBoundaryState>
{
	private static EmailLineBreak = "%0D%0A";

	constructor(props: RouteComponentProps)
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
		this.setState({hasError: true, error, errorInfo});

		console.error(error, errorInfo);

		// When the error shows up, we still want people to be able to navigate after it.
		// So, we will listen to one history change and remove the error state at that point.
		const unregisterCallback = this.props.history.listen((location) => {
			unregisterCallback();

			this.setState({
				hasError: false,
				error: null,
				errorInfo: null
			});
		});
	}

	private generateReportLines(joinWith: string)
	{
		return [
			`URL: ${location.href}`,
			`Timestamp: ${(new Date()).toISOString()}`,
			`Browser: ${navigator.userAgent}`,
			`Platform: ${navigator.platform}`,
			`Responsive Size: ${Responsive.determineMq().join(", ")}`,
			`Error: ${this.state.error.stack}`,
			`Settings: ${JSON.stringify(App.Instance.settingsDispatcher.state)}`
		].join(joinWith);
	}

	public render()
	{
		if (this.state.hasError)
		{
			const desc = <Row gutter={16}>
				<Col span={24}>
					<div>
						<br/>
						<Button type={"primary"} size={"large"}>
							<a href={`mailto:baseball.theater@gmail.com?subject=Baseball.Theater%20Error&body=${this.generateReportLines(ErrorBoundaryInternal.EmailLineBreak)}`}>Please click here to send an error report</a>
						</Button>
					</div>
					<pre style={{fontSize: "11px", marginTop: "3rem"}}>
						{this.generateReportLines("\n")}
					</pre>
				</Col>
				{Config.Environment === Environments.Local &&
				<Col span={24} style={{marginTop: "3rem"}}>
					{this.state.error.toString()}
					<pre style={{whiteSpace: "pre-line"}}>
						{this.state.errorInfo.componentStack}
					</pre>
				</Col>
				}
			</Row>;

			return <React.Fragment>
				<Alert
					style={{margin: 16}}
					message="Uh oh, something went wrong! Click the button below to send a detailed error report to baseball.theater@gmail.com."
					description={desc}
					type="error"
					showIcon
				/>
			</React.Fragment>;
		}

		return this.props.children;
	}
}

export const ErrorBoundary = withRouter(ErrorBoundaryInternal);