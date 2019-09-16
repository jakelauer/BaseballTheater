import * as React from "react";
import {MlbClientDataFetcher} from "../../Global/Mlb/MlbClientDataFetcher";
import {GameMedia} from "baseball-theater-engine/dist";
import styles from "./Highlights.module.scss";
import {Highlight} from "../../UI/Highlight";
import {Grid} from "@material-ui/core";

interface IHighlightsProps
{
	gamePk: string;
}

interface DefaultProps
{
}

type Props = IHighlightsProps & DefaultProps;
type State = IHighlightsState;

interface IHighlightsState
{
	gameMedia: GameMedia;
}

export class Highlights extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			gameMedia: null
		};
	}

	public componentDidMount(): void
	{
		MlbClientDataFetcher.getGameMedia(this.props.gamePk)
			.then(data => this.setState({
					gameMedia: data
				}
			))
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

		return (
			<div className={styles.wrapper}>
				<div className={styles.featured}>
				</div>
				<Grid container className={styles.rest} spacing={3}>
					{rest.map(item => (
						<Grid item xs={12} sm={6} lg={4} xl={3}>
							<Highlight media={item} className={styles.highlight}/>

						</Grid>
					))}
				</Grid>
			</div>
		);
	}
}

