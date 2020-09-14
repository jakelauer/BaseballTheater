import * as React from "react";
import {MediaItem, MediaItemPlayback} from "baseball-theater-engine";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography} from "@material-ui/core";
import styles from "./Highlight.module.scss";
import classNames from "classnames";
import Skeleton from "@material-ui/lab/Skeleton";
import CardHeader from "@material-ui/core/CardHeader";
import {SettingsDataStore} from "../Global/Settings/SettingsDataStore";
import {SiteRoutes} from "../Global/Routes/Routes";
import moment from "moment";
import {ChromecastUtils} from "../Utility/ChromecastUtils";
import {FaPlay} from "react-icons/fa";

interface IHighlightProps
{
	media?: MediaItem;
	className?: string;
	showExtra?: boolean;
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
		const images = this.props.media.image?.cuts ?? [];

		return images.find(a => a.aspectRatio === "16:9" && a.width < 1000 && a.width > 500)
			|| images.find(a => a.aspectRatio === "16:9")
			|| images[0];
	}

	private get defaultVideo()
	{
		return this.props.media?.playbacks?.filter(a => a.url.includes(".mp4"))[0];
	}

	private getKLabel(media: MediaItemPlayback)
	{
		const matches = media.url.match(/([0-9]{3,5})k/gi);

		const Klabel = matches?.[0] ?? "Standard";
		const numberVal = parseInt(Klabel);
		let label = Klabel;
		if (!isNaN(numberVal))
		{
			if (numberVal < 4000)
			{
				label = "Low";
			}
			else if (numberVal >= 4000 && numberVal < 15000)
			{
				label = "Standard";
			}
			else if (numberVal >= 15000)
			{
				label = "High";
			}
		}

		return label;
	}

	public render()
	{
		const {media, loading} = this.props;

		if (!media?.image)
		{
			return null;
		}

		let mp4s = media && media.playbacks && media.playbacks.filter(a => a.url.includes(".mp4")) || [];
		mp4s = mp4s
			.reduce((unique, item) =>
			{
				return unique.find(a => a.url === item.url) ? unique : [...unique, item];
			}, [] as MediaItemPlayback[])
			.sort((a, b) =>
			{
				return parseInt(b.width) - parseInt(a.width);
			})
			.slice(0, 3);

		const actions = (
			<CardActions>
				{mp4s && !loading
					? mp4s.map(a => (
						<a href={a.url} target={"_blank"} key={a.url} onClick={e => ChromecastUtils.TryCast(e, a.url)}>
							<Button size="small" color="primary" startIcon={<FaPlay/>}>
								{this.getKLabel(a)}
							</Button>
						</a>
					))
					: <Skeleton variant={"rect"} width={"100%"} height={30}/>
				}
			</CardActions>
		);

		const mediaTitle = media?.title ?? "";

		const isRecap = mediaTitle.match(/recap/gi) ?? false;
		const isCondensed = mediaTitle.match(/cg/gi) ?? false;

		let title = isRecap
			? "Recap"
			: isCondensed
				? "Condensed Game"
				: media?.title;

		const description = isRecap || isCondensed ? "" : media?.description;

		const gamePk = media?.keywordsAll?.find(k => k.type === "game_pk")?.value;

		const date = moment(media.date);

		return (
			<Card className={classNames(this.props.className, styles.highlight)}>
				<div className={styles.cardContent}>
					{this.defaultVideo && !loading ?
						<a href={this.defaultVideo.url} target={"_blank"}>
							<CardMedia
								className={styles.cardMedia}
								image={this.image?.src}
								title={media?.image?.altText}
							/>

						</a>
						: <Skeleton variant={"rect"} width={"100%"} height={150}/>
					}
					<div className={styles.meta}>
						<CardActionArea className={styles.actionArea}>
							{!loading && this.defaultVideo && (
								<CardContent>
									<a href={this.defaultVideo.url} target={"_blank"}>
										<Typography gutterBottom variant="h6" component="h2" className={styles.title}>
											{title}
										</Typography>
										{SettingsDataStore.state.highlightDescriptions && (
											<Typography variant="body2" color="textSecondary" component="p">
												[{media.duration}] {description}
											</Typography>
										)}
									</a>
								</CardContent>
							)}
						</CardActionArea>
						{actions}
					</div>
				</div>
				{this.props.showExtra && (
					<PossibleLink content={<span>{date.format("MMM D, YYYY")} &raquo;</span>} gamePk={gamePk}/>
				)}
			</Card>
		);
	}
}

interface PLProps
{
	gamePk: string;
	content: React.ReactNode;
}

const PossibleLink = ({gamePk, content}: PLProps) =>
{
	const cardHeader = (
		<CardHeader style={{padding: "0.25rem 0.5rem", borderTop: "1px solid #EEE"}} subheader={content} titleTypographyProps={{
			variant: "button"
		}}/>
	);

	return gamePk
		? (
			<a href={SiteRoutes.Game.resolve({gameId: gamePk})}>
				{cardHeader}
			</a>
		)
		: cardHeader;
};