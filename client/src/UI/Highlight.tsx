import * as React from "react";
import {MediaItem} from "baseball-theater-engine";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography} from "@material-ui/core";
import styles from "./Highlight.module.scss";
import {Respond} from "../Global/Respond/Respond";
import classNames from "classnames";
import Skeleton from "@material-ui/lab/Skeleton";
import {RespondSizes} from "../Global/Respond/RespondIntercom";

interface IHighlightProps
{
	media?: MediaItem;
	className?: string;
}

interface DefaultProps
{
	loading: boolean;
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

	public static defaultProps: DefaultProps = {
		loading: false
	};

	private get image()
	{
		const images = this.props.media.image.cuts;

		return images.find(a => a.aspectRatio === "16:9" && a.width < 1000 && a.width > 500)
			|| images.find(a => a.aspectRatio === "16:9")
			|| images[0];
	}

	private get defaultVideo()
	{
		return this.props.media?.playbacks?.filter(a => a.url.includes(".mp4"))[0]
			|| undefined;
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
		const {media, loading} = this.props;

		const mp4s = media && media.playbacks && media.playbacks.filter(a => a.url.includes(".mp4")) || [];

		const actions = (
			<CardActions>
				{mp4s && !loading
					? mp4s.map(a => (
						<a href={a.url} target={"_blank"}>
							<Button size="small" color="primary">
								{this.getKLabel(a.url, a.name)}
							</Button>
						</a>
					))
					: <Skeleton variant={"rect"} width={"100%"} height={30}/>
				}
			</CardActions>
		);

		return (
			<Card className={classNames(this.props.className, styles.highlight)}>
				{this.defaultVideo && !loading ?
					<a href={this.defaultVideo.url} target={"_blank"}>
						<CardMedia
							className={styles.cardMedia}
							image={this.image.src}
							title={media.image.altText}
						/>

					</a>
					: <Skeleton variant={"rect"} width={"100%"} height={150}/>
				}
				<div className={styles.meta}>
					<CardActionArea className={styles.actionArea}>
						<CardContent>
							{!loading && this.defaultVideo &&
                            <a href={this.defaultVideo.url} target={"_blank"}>
                                <Typography gutterBottom variant="h5" component="h2" className={styles.title}>
									{media.title}
                                </Typography>
                                <Respond at={RespondSizes.small} hide={true}>
                                    <Typography variant="body2" color="textSecondary" component="p">
										{media.description}
                                    </Typography>
                                </Respond>
                            </a>
							}
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