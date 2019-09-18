import * as React from "react";
import {GameMedia} from "baseball-theater-engine";
import styles from "./Highlights.module.scss";
import {Highlight} from "../../UI/Highlight";
import {CircularProgress, Grid} from "@material-ui/core";

interface IHighlightsProps
{
	gamePk: string;
	media: GameMedia;
}

interface DefaultProps
{
}

type Props = IHighlightsProps & DefaultProps;
type State = IHighlightsState;

interface IHighlightsState
{
}

export class Highlights extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
		};
	}

	private get highlights()
	{
		return this.props.media
			&& this.props.media.highlights
			&& this.props.media.highlights.highlights
			&& this.props.media.highlights.highlights.items
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
						!this.props.media
							? <CircularProgress className={styles.progress}/>
							: restRendered
					}
				</Grid>
			</div>
		);
	}
}

