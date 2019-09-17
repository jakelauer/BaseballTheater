import * as React from "react";
import {MlbClientDataFetcher} from "../../Global/Mlb/MlbClientDataFetcher";
import {GameMedia} from "baseball-theater-engine/dist";
import styles from "./Highlights.module.scss";
import {Highlight} from "../../UI/Highlight";
import {CircularProgress, Grid} from "@material-ui/core";
import {GameIntercom} from "./Components/GameIntercom";

interface IHighlightsProps
{
	gamePk: string;
	gameIntercom: GameIntercom;
}

interface DefaultProps
{
}

type Props = IHighlightsProps & DefaultProps;
type State = IHighlightsState;

interface IHighlightsState
{
	gameMedia: GameMedia;
	loading: boolean;
}

export class Highlights extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			gameMedia: null,
			loading: true
		};
	}

	public componentDidMount(): void
	{
		this.fetchData();

		this.props.gameIntercom.listen(() => this.fetchData());
	}

	private fetchData()
	{
		this.setState({
			loading: true
		});

		MlbClientDataFetcher.getGameMedia(this.props.gamePk)
			.then(data => this.setState({
					gameMedia: data,
					loading: false
				}
			));
	}

	private get highlights()
	{
		return this.state.gameMedia
			&& this.state.gameMedia.highlights
			&& this.state.gameMedia.highlights.highlights
			&& this.state.gameMedia.highlights.highlights.items
			|| [];
	}

	public render()
	{
		const recap = this.highlights.find(a => a.keywordsAll.some(a => a.value.toLocaleLowerCase().includes("recap")));
		const condensed = this.highlights.find(a => a.keywordsAll.some(a => a.value.toLocaleLowerCase().includes("condensed")));
		const rest = this.highlights.filter(a => a !== condensed && a !== recap);

		const restRendered = rest.map(item => (
			<Grid item xs={12} sm={6} lg={4} xl={3}>
				<Highlight media={item} className={styles.highlight}/>
			</Grid>
		));

		return (
			<div className={styles.wrapper}>
				<div className={styles.featured}>
				</div>
				<Grid container className={styles.rest} spacing={3}>
					{
						this.state.loading
							? <CircularProgress className={styles.progress}/>
							: restRendered
					}
				</Grid>
			</div>
		);
	}
}

