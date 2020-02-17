import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {ITeams, Teams} from "baseball-theater-engine/contract/teams";
import {VideoSearchWithMetadata} from "baseball-theater-engine";
import {CircularProgress, Grid} from "@material-ui/core";
import styles from "./TeamsArea.module.scss";
import {Highlight} from "../../UI/Highlight";
import {ContainerProgress} from "../../UI/ContainerProgress";
import Typography from "@material-ui/core/Typography";

interface ITeamsAreaProps
{
}

interface DefaultProps
{
}

type Props = ITeamsAreaProps & DefaultProps & RouteComponentProps<{ teamFileCode: string }>;
type State = ITeamsAreaState;

interface ITeamsAreaState
{
	videos: VideoSearchWithMetadata[];
	page: number;
	loading: boolean;
}

class TeamsArea extends React.Component<Props, State>
{
	private loading = false;

	constructor(props: Props)
	{
		super(props);

		this.state = {
			videos: [],
			page: 1,
			loading: true
		};
	}

	public componentDidMount(): void
	{
		this.loadNextPage();

		window.addEventListener("scroll", () =>
		{
			const scrollMax = document.body.scrollHeight - window.innerHeight;
			const scroll = window.scrollY;
			if (scrollMax - scroll < 50 && !this.loading)
			{
				this.loading = true;
				this.setState({
					page: this.state.page + 1,
					loading: true
				})
			}
		});
	}

	public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void
	{
		if (prevProps.match.params.teamFileCode !== this.props.match.params.teamFileCode)
		{
			this.setState({
				page: 1,
				videos: [],
				loading: true
			}, this.loadNextPage);
		}
		else if (prevState.page !== this.state.page)
		{
			this.loadNextPage();
		}
	}

	private loadNextPage()
	{
		fetch(`/api/team?page=${this.state.page}&team=${this.props.match.params.teamFileCode}`, {
			headers: {
				"x-app": "baseballtheater",
				"x-api-key": "78AF1CF0-6D5F-4360-83BA-7AF7599EF107"
			}
		})
			.then(r => r.json())
			.then((data: VideoSearchWithMetadata[]) =>
			{
				this.setState({
					videos: [...this.state.videos, ...data],
					loading: false
				});

				this.loading = false;
			});
	}

	public render()
	{
		const team = Teams.TeamList[this.props.match.params.teamFileCode as keyof ITeams];

		return (
			<div className={styles.wrapper}>
				<Typography style={{marginBottom: "2rem"}} variant={"h4"}>
					Recent {team} Highlights
				</Typography>
				<Grid container className={styles.rest} spacing={3} style={{paddingLeft: 0, marginBottom: "2rem"}}>
					{this.state.videos.map(video => (
						<Grid key={video.video.guid} item xs={12} sm={12} md={6} lg={4} xl={3}>
							<Highlight media={video.video} className={styles.highlight}/>
						</Grid>
					))}
				</Grid>
				{this.state.videos.length === 0 && <ContainerProgress/>}
				{this.state.loading && this.state.videos.length !== 0 && <CircularProgress/>}
			</div>
		);
	}
}

export default withRouter(TeamsArea);