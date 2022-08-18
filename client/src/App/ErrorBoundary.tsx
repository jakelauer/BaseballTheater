import { Button } from '@material-ui/core';
import { ErrorInfo, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useErrorBoundary } from 'use-error-boundary';

import { SettingsDataStore } from '../Global/Settings/SettingsDataStore';

interface IErrorBoundaryProps {
	children?: React.ReactNode;
}

/** This class exists to handle error cases more gracefully than having the app just disappear.
 *  * If a child component errors out, it will display a message with error details */
export const ErrorBoundary: React.FC<IErrorBoundaryProps> = (props) => {
	const EmailLineBreak = "%0D%0A";
	const [hasError, setHasError] = useState(false);
	const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
	const location = useLocation();

	const {
		didCatch,
		error,
		reset,
		ErrorBoundary: InnerBoundary
	} = useErrorBoundary({
		onDidCatch: (error, errorInfo) => { setErrorInfo(errorInfo) }
	});

	if (didCatch) {
		console.error(error, errorInfo);
		setHasError(true);
	}

	useEffect(() => {
		setHasError(false);
		setErrorInfo(null);
		//reset();
	}, [location.pathname, reset]);

	const generateReportLines = (joinWith: string) => {
		return [
			`URL: ${window.location.href}`,
			`Timestamp: ${(new Date()).toISOString()}`,
			`Browser: ${navigator.userAgent}`,
			`Platform: ${navigator.platform}`,
			`More info: ${errorInfo.componentStack.split("\n").join(joinWith)}`,
			`Settings: ${JSON.stringify(SettingsDataStore.state)}`
		].join(joinWith);
	}

	const openEmail = () => {
		window.location.href = (`mailto:baseball.theater@gmail.com?subject=Baseball.Theater%20Error&body=${generateReportLines(EmailLineBreak)}`);
		return;
	};

	if (hasError) {
		const desc = (
			<div>
				<div>
					<br />
					<Button variant={"contained"} color={"primary"} style={{ color: "white" }} onClick={openEmail}>
						Please click here to send an error report
					</Button>
				</div>
				<pre style={{ fontSize: "11px", marginTop: "3rem" }}>
					{generateReportLines("\n")}
				</pre>
			</div>
		);

		return <div>
			<h2>Uh oh, something went wrong!</h2>
			<div>{desc}</div>
		</div>;
	}

	return <InnerBoundary>{props.children}</InnerBoundary>;
}