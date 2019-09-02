import React from 'react';
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import {LightTheme, BaseProvider, styled} from 'baseui';
import './App.css';
import {FlexGrid, FlexGridItem} from "baseui/flex-grid";
import {GamesArea} from "./Areas/Games/GamesArea";

export class App extends React.Component<{}, { data: string }>
{
	constructor(props: {})
	{
		super(props);

		this.state = {
			data: ""
		};
	}

	componentDidMount()
	{
		// Call our fetch function below once the component mounts
		this.callBackendAPI()
			.then(res => this.setState({data: res.express}))
			.catch(err => console.log(err));
	}

	// Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from
	// server.js
	callBackendAPI = async () =>
	{
		const response = await fetch('/express_backend');
		const body = await response.json();

		if (response.status !== 200) {
			throw Error(body.message)
		}
		return body;
	};

	public render()
	{
        const engine = new Styletron();

        return (
			<StyletronProvider value={engine}>
				<BaseProvider theme={LightTheme}>
					<div className="App">
						<FlexGrid>
							<FlexGridItem>
								Baseball Theater
							</FlexGridItem>
						</FlexGrid>
						<FlexGrid>
							<FlexGridItem>
								<GamesArea/>
							</FlexGridItem>
						</FlexGrid>
					</div>
				</BaseProvider>
			</StyletronProvider>
		);
	}
}

export default App;
