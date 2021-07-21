import * as React from "react";
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
import {GqlSearchMediaPlayback} from "../Areas/Search/NewSearch";

interface IHighlightProps
{
	videos: GqlSearchMediaPlayback;
	imageSrc: string;
	imageAlt: string;
	mediaDate: string;
	mediaDescription: string;
	gamePk: number;
	mediaTitle: string;
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

export class GqlSearchHighlight extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);
	}

	public static defaultProps: DefaultProps = {
		loading: false
	};

	private getKLabel(mediaUrl: string)
	{
		const matches = mediaUrl.match(/([0-9]{3,5})k/gi);

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

	private get defaultVideo()
	{
		return this.props.videos?.filter(a => a.url.includes(".mp4"))[0];
	}

	public render()
	{
		const {gamePk, mediaDate, mediaDescription, mediaTitle, videos, loading} = this.props;

		const actions = (
			<CardActions>
				{videos && !loading
					? videos.map(a => (
						<a href={a.url} target={"_blank"} key={a.url} onClick={e => ChromecastUtils.TryCast(e, a.url)}>
							<Button size="small" color="primary" startIcon={<FaPlay/>}>
								{this.getKLabel(a.url)}
							</Button>
						</a>
					))
					: <Skeleton variant={"rect"} width={"100%"} height={30}/>
				}
			</CardActions>
		);

		const isRecap = mediaTitle.match(/recap/gi) ?? false;
		const isCondensed = mediaTitle.match(/cg/gi) ?? false;

		let title = isRecap
			? "Recap"
			: isCondensed
				? "Condensed Game"
				: mediaTitle;

		const description = isRecap || isCondensed ? "" : mediaDescription;

		const date = moment(mediaDate);

		return (
			<Card className={classNames(this.props.className, styles.highlight)}>
				<div className={styles.cardContent}>
					{this.defaultVideo && !loading ?
						<a href={this.defaultVideo.url} target={"_blank"}>
							<CardMedia
								className={styles.cardMedia}
								image={this.props.imageSrc}
								title={this.props.imageAlt}
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
												{description}
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
					<PossibleLink content={<span>{date.format("MMM D, YYYY")} &raquo;</span>} gamePk={String(gamePk)}/>
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