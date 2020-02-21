import * as React from "react";
import {GameMedia, LiveData} from "baseball-theater-engine";
import {Typography} from "@material-ui/core";
import styles from "./Wrap.module.scss";
import Helmet from "react-helmet";
import moment from "moment";
import {ContainerProgress} from "../../UI/ContainerProgress";
import MarkdownIt from "markdown-it/lib";

const md = new MarkdownIt({
	html: true,
	linkify: true
});

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
			return <ContainerProgress/>;
		}

		const mlbRecap = this.props.media.editorial.recap.mlb;

		let parsed = md.render(`&nbsp;${mlbRecap.body}&nbsp;`);

		// remove dot items
		const inner = document.createElement("div");
		inner.innerHTML = parsed;
		for (let childrenKey in inner.children)
		{
			if (inner.children[childrenKey].textContent?.includes("•"))
			{
				inner.removeChild(inner.children[childrenKey]);
			}
		}
		parsed = inner.innerHTML;

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