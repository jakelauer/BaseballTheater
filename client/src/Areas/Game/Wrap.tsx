import * as React from "react";
import {GameIntercom} from "./Components/GameIntercom";
import {GameMedia} from "baseball-theater-engine";
import {CircularProgress, Typography} from "@material-ui/core";
import styles from "./Wrap.module.scss";
import marked from "marked";

interface IWrapProps
{
	gameIntercom: GameIntercom;
}

interface DefaultProps
{
}

type Props = IWrapProps & DefaultProps;
type State = IWrapState;

interface IWrapState
{
	media: GameMedia;
}

export class Wrap extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			media: props.gameIntercom.current.media
		}
	}

	public componentDidMount(): void
	{
		this.props.gameIntercom.listen(data => this.setState({
			media: data.media
		}));
	}

	public render()
	{
		if (!this.state.media
			|| !this.state.media.editorial
			|| !this.state.media.editorial.recap
			|| !this.state.media.editorial.recap.mlb)
		{
			return <CircularProgress className={styles.progress}/>;
		}

		const mlbRecap = this.state.media.editorial.recap.mlb;

		const parsed = marked(mlbRecap.body);

		return (
			<div className={styles.wrapper}>
				<Typography variant={"h3"} className={styles.title}>
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