import * as React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css"
import {Dialog, DialogContent} from "@material-ui/core";
import "./swagger-overrides.scss";
import ReactJson from "react-json-view";

interface IApiTestAreaProps
{
}

interface DefaultProps
{
}

type Props = IApiTestAreaProps & DefaultProps;
type State = IApiTestAreaState;

interface IApiTestAreaState
{
	pre: any;
}

export default class ApiTestArea extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			pre: undefined
		};
	}

	private readonly onResponse = (r: { [key: string]: any }) =>
	{
		const pre = JSON.stringify(r.body, null, 2);

		if (pre.includes("swagger"))
		{
			return;
		}

		this.setState({
			pre: r.body
		});

		return r;
	};

	public render()
	{
		return (
			<React.Fragment>
				<SwaggerUI docExpansion={"list"} url={"/swagger.json"} responseInterceptor={this.onResponse}/>
				<Dialog open={!!this.state.pre} onClose={() => this.setState({pre: undefined})}>
					<DialogContent>
						<ReactJson src={this.state.pre}/>
					</DialogContent>
				</Dialog>
			</React.Fragment>
		);
	}
}