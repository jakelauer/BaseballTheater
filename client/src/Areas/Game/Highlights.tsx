import * as React from "react";
import {GameMedia, LiveData} from "baseball-theater-engine";
import styles from "./Highlights.module.scss";
import {Highlight} from "../../UI/Highlight";
import {Grid} from "@material-ui/core";
import {ContainerProgress} from "../../UI/ContainerProgress";
import moment from "moment";
import Helmet from "react-helmet";
import Divider from "@material-ui/core/Divider";

interface IHighlightsProps
{
	gamePk: string;
	media: GameMedia;
	liveData: LiveData;
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

		this.state = {};
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
		if (!this.props.liveData?.gameData)
		{
			return <ContainerProgress/>;
		}

		const recap = this.highlights.find(a => a.keywordsAll.some(a => a.value.toLocaleLowerCase().includes("recap")));
		const condensed = this.highlights.find(a => a.keywordsAll.some(a => a.value.toLocaleLowerCase().includes("condensed")));
		const rest = this.highlights.filter(a => a !== condensed && a !== recap);

		const videosOrSkeleton = rest.length ? rest : Array(20).fill(0);

		const restRendered = videosOrSkeleton.map(item => (
			<Grid key={item.guid} item xs={12} sm={12} md={6} lg={4} xl={3}>
				<Highlight media={item} className={styles.highlight}/>
			</Grid>
		));

		const teams = this.props.liveData.gameData.teams;
		const date = moment(this.props.liveData.gameData.datetime.dateTime).format("MMMM D, YYYY");

		return (
			<div className={styles.wrapper}>
				<Helmet>
					<title>{`Highlights - ${teams.away.teamName} @ ${teams.home.teamName}, ${date}`}</title>
				</Helmet>
				<Grid container className={styles.rest} spacing={3} style={{paddingLeft: 0, marginBottom: "2rem"}}>
					{recap &&
                    <Grid item lg={4} xs={12} sm={12} md={6}>
                        <Highlight media={recap} className={styles.highlight}/>
                    </Grid>
					}
					{condensed &&
                    <Grid item lg={4} xs={12} sm={12} md={6}>
                        <Highlight media={condensed} className={styles.highlight}/>
                    </Grid>
					}
				</Grid>
				<Divider style={{marginBottom: "2rem"}}/>
				<Grid container className={styles.rest} spacing={3} style={{paddingLeft: 0}}>
					{restRendered}
					{!this.props.media && <ContainerProgress/>}
				</Grid>
			</div>
		);
	}
}

