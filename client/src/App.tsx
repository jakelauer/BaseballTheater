import React from 'react';
import './App.css';
import {MediaItem} from "baseball-theater-engine/contract/media";
import {VideoSearchResults} from 'baseball-theater-engine';
import {Button, CircularProgress, DialogContent, Grid} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";

interface VideoSearch
{
	about: VideoSearchResults;
	video: MediaItem;
}

interface IAppState
{
	data: VideoSearch[];
	search: string;
	loading: boolean;
	error: string;
}

export class App extends React.Component<{}, IAppState>
{
	private apiTimeout: number = null;

	constructor(props: {})
	{
		super(props);

		this.state = {
			error: "",
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
			const response = await fetch(`/video/tag-search/${this.state.search}/1`, {
				headers: {
					"x-app": "playback",
					"x-api-key": "NER6GF4-B36417M-K3QWDMP-NRHSFC5"
				}
			});
			const body = await response.json();

			if (response.status === 200)
			{
				this.setState({
					loading: false,
					data: body.express
				});
			}
			else
			{
				this.setState({
					error: body.error,
					loading: false
				});
			}

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
			<CircularProgress/>
			: null;

		return (
			<div className="App">
				<Grid container>
					<Grid item>
						<Button variant="contained" color={"primary"}
						        onClick={() => this.searchTag("fastcast")}>FastCast</Button>
						<Button variant="contained" color={"primary"}
						        onClick={() => this.searchTag("top-10-home-runs")}>Top 10 Home Runs</Button>
						<Button variant="contained" color={"primary"} onClick={() => this.searchTag("mlb-network")}>MLB
							Network</Button>
					</Grid>
				</Grid>
				<Grid container>
					{loading}
				</Grid>
				<Grid container>
					{vids}
				</Grid>
				<Dialog open={this.state.error !== ""} onClose={() => this.setState({error: ""})}>
					<DialogTitle>Error</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{this.state.error}
						</DialogContentText>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
}

export default App;
