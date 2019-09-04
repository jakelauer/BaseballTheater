import React from 'react';
import './App.css';
import {MediaItem} from "baseball-theater-engine/contract/media";
import {VideoSearchResults} from 'baseball-theater-engine';
import {Button, CircularProgress, Grid} from "@material-ui/core";

interface VideoSearch
{
	about: VideoSearchResults;
	video: MediaItem;
}

export class App extends React.Component<{}, { data: VideoSearch[], search: string, loading: boolean }>
{
	private apiTimeout: number = null;

	constructor(props: {})
	{
		super(props);

		this.state = {
			search: "",
			loading: false,
			data: []
		};
	}

	componentDidMount()
	{
	}

	// Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from
	// server.ts
	callBackendAPI = async () =>
	{
		clearTimeout(this.apiTimeout);

		this.apiTimeout = window.setTimeout(async () =>
		{
			const response = await fetch(`/video/tag-search/${this.state.search}/1`);
			const body = await response.json();

			if (response.status !== 200) {
				throw Error(body.message)
			}

			this.setState({
				loading: false,
				data: body.express
			});
		}, 500);
	};

	private searchTag = (tag: string) =>
	{
		this.setState({
			search: tag,
			data: [],
			loading: true
		}, () =>
		{
			// Call our fetch function below once the component mounts
			this.callBackendAPI();
		});
	};

	public render()
	{
		const vids = this.state.data.map(item => (
			<Grid item key={item.about.id}>
				<a href={item.video.playbacks[0].url}>
					<img src={item.about.image.cuts[0].src}/>
					<br/>
					<h2>{item.about.title}</h2>
				</a>
			</Grid>
		));

		const loading = this.state.loading ?
			<CircularProgress />
			: null;

		return (
			<div className="App">
				<Grid container>
					<Grid item>
						<Button variant="contained" color={"primary"} onClick={() => this.searchTag("fastcast")}>FastCast</Button>
						<Button variant="contained" color={"primary"} onClick={() => this.searchTag("top-10-home-runs")}>Top 10 Home Runs</Button>
						<Button variant="contained" color={"primary"} onClick={() => this.searchTag("mlb-network")}>MLB Network</Button>
					</Grid>
				</Grid>
				<Grid container>
					{loading}
				</Grid>
				<Grid container>
					{vids}
				</Grid>
			</div>
		);
	}
}

export default App;
