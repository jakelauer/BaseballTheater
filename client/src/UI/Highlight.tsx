import * as React from "react";
import {MediaItem} from "baseball-theater-engine";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography} from "@material-ui/core";
import styles from "./Highlight.module.scss";
import {Respond, RespondSizes} from "../Global/Respond/Respond";
import classNames from "classnames";

interface IHighlightProps
{
	media: MediaItem;
	className?: string;
}

interface DefaultProps
{
}

type Props = IHighlightProps & DefaultProps;
type State = IHighlightState;

interface IHighlightState
{
}

export class Highlight extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);
	}

	private get image()
	{
		const images = this.props.media.image.cuts;

		return images.find(a => a.aspectRatio === "16:9" && a.width < 1000 && a.width > 500)
			|| images.find(a => a.aspectRatio === "16:9")
			|| images[0];
	}

	private get defaultVideo()
	{
		return this.props.media.playbacks
			&& this.props.media.playbacks.filter(a => a.url.includes(".mp4"))[0];
	}

	private getKLabel(url: string, alt: string)
	{
		const matches = url.match(/([0-9]{3,5})k/gi);

		return matches && matches.length >= 1
			? matches[0]
			: alt;
	}

	public render()
	{
		if (!this.props.media || !this.props.media.playbacks)
		{
			return null;
		}

		const mp4s = this.props.media.playbacks.filter(a => a.url.includes(".mp4"));

		const actions = (
			<CardActions>
				{mp4s.map(a => (
					<a href={a.url} target={"_blank"}>
						<Button size="small" color="primary">
							{this.getKLabel(a.url, a.name)}
						</Button>
					</a>
				))}
			</CardActions>
		);

		return (
			<Card className={classNames(this.props.className, styles.highlight)}>
				<a href={this.defaultVideo.url} target={"_blank"}>
					<CardMedia
						className={styles.cardMedia}
						image={this.image.src}
						title={this.props.media.image.altText}
					/>
				</a>
				<div className={styles.meta}>
					<CardActionArea className={styles.actionArea}>
						<CardContent>
							<a href={this.defaultVideo.url} target={"_blank"}>
								<Typography gutterBottom variant="h5" component="h2" className={styles.title}>
									{this.props.media.title}
								</Typography>
								<Respond at={RespondSizes.small} hide={true}>
									<Typography variant="body2" color="textSecondary" component="p">
										{this.props.media.description}
									</Typography>
								</Respond>
							</a>
						</CardContent>
					</CardActionArea>
					<Respond at={RespondSizes.small} hide={false}>
						{actions}
					</Respond>
				</div>
			</Card>
		);
	}
}