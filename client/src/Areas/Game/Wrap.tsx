import * as React from "react";
import {GameMedia, LiveData} from "baseball-theater-engine";
import {CircularProgress, Typography} from "@material-ui/core";
import styles from "./Wrap.module.scss";
import marked from "marked";
import Helmet from "react-helmet";
import moment from "moment";

interface IWrapProps
{
	media: GameMedia;
	liveData: LiveData;
}

interface DefaultProps
{
}

type Props = IWrapProps & DefaultProps;
type State = IWrapState;

interface IWrapState
{
}

export class Wrap extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
		}
	}

	public render()
	{
		if (!this.props.media?.editorial?.recap?.mlb || !this.props.liveData)
		{
			return <CircularProgress className={styles.progress}/>;
		}

		const mlbRecap = this.props.media.editorial.recap.mlb;

		const parsed = marked(mlbRecap.body);

		const teams = this.props.liveData.gameData.teams;
		const date = moment(this.props.liveData.gameData.datetime.dateTime).format("MMMM D, YYYY");

		return (
			<div className={styles.wrapper}>
				<Helmet>
					<title>{`Wrap - ${teams.away.teamName} @ ${teams.home.teamName}, ${date}`}</title>
				</Helmet>
				<Typography variant={"h4"} className={styles.title}>
					{mlbRecap.headline}
				</Typography>
				<Typography
					className={styles.wrap}
					variant={"body1"}
					dangerouslySetInnerHTML={{__html: parsed}}
				/>
			</div>
		);
	}
}