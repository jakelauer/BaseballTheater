import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {Button} from "@material-ui/core";
import {SettingsIntercom} from "../Global/Settings/SettingsIntercom";

interface IErrorBoundaryProps
{
}

interface DefaultProps
{
}

type Props = IErrorBoundaryProps & DefaultProps;
type State = IErrorBoundaryState;

interface IErrorBoundaryState
{
	error: Error;
	errorInfo: React.ErrorInfo;
}

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
	private static EmailLineBreak = "%0D%0A";

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
		this.setState({hasError: true, error, errorInfo});

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

	private generateReportLines(joinWith: string)
	{
		return [
			`Describe the issue:`,
			``,
			`URL: ${location.href}`,
			`Timestamp: ${(new Date()).toISOString()}`,
			`Browser: ${navigator.userAgent}`,
			`Platform: ${navigator.platform}`,
			`Error: ${this.state.error.stack}`,
			`More info: ${this.state.errorInfo.componentStack}`,
			`Settings: ${JSON.stringify(SettingsIntercom.state)}`
		].join(joinWith);
	}

	public render()
	{
		if (this.state.hasError)
		{
			const desc = (
				<div>
					<div>
						<br/>
						<Button variant={"contained"} color={"primary"} style={{color: "white"}}>
							<a target={"_blank"} style={{color: "white"}} href={`mailto:baseball.theater@gmail.com?subject=Baseball.Theater%20Error&body=${this.generateReportLines(ErrorBoundaryInternal.EmailLineBreak)}`}>Please click here to send an error report</a>
						</Button>
					</div>
					<pre style={{fontSize: "11px", marginTop: "3rem"}}>
						{this.generateReportLines("\n")}
					</pre>
				</div>
			);

			return <div>
				<h2>Uh oh, something went wrong!</h2>
				<div>{desc}</div>
				<div>
					{this.generateReportLines("\n")}
				</div>
			</div>;
		}

		return this.props.children;
	}
}

export const ErrorBoundary = withRouter(ErrorBoundaryInternal);