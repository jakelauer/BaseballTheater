import * as React from "react";
import {GameMedia} from "baseball-theater-engine";
import styles from "./Highlights.module.scss";
import {Highlight} from "../../UI/Highlight";
import {Grid} from "@material-ui/core";
import {ContainerProgress} from "../../UI/ContainerProgress";

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

		const videosOrSkeleton = rest.length ? rest : Array(20).fill(0);

		const restRendered = videosOrSkeleton.map(item => (
			<Grid key={item.guid} item xs={12} sm={12} md={6} lg={4} xl={3}>
				<Highlight media={item} className={styles.highlight}/>
			</Grid>
		));

		return (
			<div className={styles.wrapper}>
				<div className={styles.featured}>
				</div>
				<Grid container className={styles.rest} spacing={3} style={{paddingLeft: 0}}>
					{restRendered}
					{!this.props.media && <ContainerProgress/>}
				</Grid>
			</div>
		);
	}
}

