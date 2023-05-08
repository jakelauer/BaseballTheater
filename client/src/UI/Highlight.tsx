import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    IconButton,
    Switch,
    Typography,
} from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';
import { MediaItem, MediaItemPlayback } from 'baseball-theater-engine';
import classNames from 'classnames';
import moment from 'moment';
import * as React from 'react';
import { useState } from 'react';
import { FaExternalLinkAlt, FaPlay } from 'react-icons/fa';

import { useDataStore } from '../Global/Intercom/DataStore';
import { RespondDataStore, RespondSizes } from '../Global/Respond/RespondDataStore';
import { SiteRoutes } from '../Global/Routes/Routes';
import { SettingsDataStore } from '../Global/Settings/SettingsDataStore';
import { ChromecastUtils } from '../Utility/ChromecastUtils';
import styles from './Highlight.module.scss';

type Queue = {
	highlights: MediaItem[];
	index: number;
};

interface IHighlightProps {
	media?: MediaItem;
	className?: string;
	showExtra?: boolean;
	queue?: Queue
}

interface DefaultProps {
	loading?: boolean;
}

type Props = IHighlightProps & DefaultProps;

export const Highlight: React.FC<Props> = (props) => {

	const [open, setOpen] = useState(false);
	const [queueVidIndex, setQueueVidIndex] = useState(props.queue?.index ?? 0);
	const settings = useDataStore(SettingsDataStore);

	const image = (m: MediaItem) => {
		const images = m.image?.cuts ?? [];

		return images.find(a => a.aspectRatio === "16:9" && a.width < 1000 && a.width > 500)
			|| images.find(a => a.aspectRatio === "16:9")
			|| images[0];
	}

	const defaultVideo = (m: MediaItem) => {
		return m?.playbacks?.filter(a => a.url.includes(".mp4"))[0];
	}

	const getKLabel = (media: MediaItemPlayback) => {
		const matches = media.url.match(/([0-9]{3,5})k/gi);

		const Klabel = matches?.[0] ?? "Standard";
		const numberVal = parseInt(Klabel);
		let label = Klabel;
		if (!isNaN(numberVal)) {
			if (numberVal < 4000) {
				label = "Low";
			}
			else if (numberVal >= 4000 && numberVal < 15000) {
				label = "Standard";
			}
			else if (numberVal >= 15000) {
				label = "High";
			}
		}

		return label;
	}

	const { media, loading } = props;

	if (!media?.image) {
		return null;
	}

	let mp4s = media?.playbacks?.filter(a => a.url.includes(".mp4")) ?? [];
	mp4s = mp4s
		.reduce((unique, item) => {
			return unique.find(a => a.url === item.url) ? unique : [...unique, item];
		}, [] as MediaItemPlayback[])
		.sort((a, b) => {
			return parseInt(b.width) - parseInt(a.width);
		})
		.slice(0, 3);

	const actions = (
		<CardActions>
			{mp4s && !loading
				? mp4s.map(a => (
					<a href={a.url} target={"_blank"} key={a.url} onClick={e => ChromecastUtils.TryCast(e, a.url)} rel="noreferrer">
						<Button size="small" color="primary" startIcon={<FaExternalLinkAlt />}>
							{getKLabel(a)}
						</Button>
					</a>
				))
				: <Skeleton variant={"rect"} width={"100%"} height={30} />
			}
		</CardActions>
	);

	const isRecap = (m: MediaItem) => m?.title?.match(/recap/gi) ?? false;
	const isCondensed = (m: MediaItem) => m?.title?.match(/cg/gi) ?? false;

	let title = (m: MediaItem) => isRecap(m)
		? "Recap"
		: isCondensed(m)
			? "Condensed Game"
			: m?.title;

	const description = isRecap(media) || isCondensed(media) ? "" : media?.description;

	const gamePk = media?.keywordsAll?.find(k => k.type === "game_pk")?.value;

	const date = moment(media.date);

	const queueUpdate = (dir: number) => {
		const max = props.queue?.highlights?.length ?? 0;
		const result = queueVidIndex + dir;
		const newIndex = result > max - 1
			? 0
			: result < 0
				? max - 1
				: result;

		setQueueVidIndex(newIndex);
	}

	const dialogMedia = props.queue?.highlights?.[queueVidIndex] ?? props.media;

	return (
		<Card className={classNames(props.className, styles.highlight)}>
			<div className={styles.cardContent}>
				{defaultVideo(media) && !loading ?
					<div className={styles.cardMediaWrapper}>
						<CardMedia
							className={styles.cardMedia}
							image={image(media)?.src}
							title={media?.image?.altText}
							onClick={() => settings.dialogs ? setOpen(true) : window.open(defaultVideo(media).url)}
						/>
						<div className={styles.cardPlay}>
							<FaPlay />
						</div>
					</div>
					: <Skeleton variant={"rect"} width={"100%"} height={150} />
				}
				<div className={styles.meta}>
					<CardActionArea className={styles.actionArea}>
						{!loading && defaultVideo(media) && (
							<CardContent onClick={() => settings.dialogs ? setOpen(true) : window.open(defaultVideo(media).url)}>
								<Typography gutterBottom variant="h6" component="h2" className={styles.title}>
									{title(media)}
								</Typography>
								{SettingsDataStore.state.highlightDescriptions && (
									<Typography variant="body2" color="textSecondary" component="p">
										[{media.duration}] {description}
									</Typography>
								)}
							</CardContent>
						)}
					</CardActionArea>
					{actions}
				</div>
			</div>
			{props.showExtra && (
				<PossibleLink content={<span>{date.format("MMM D, YYYY")} &raquo;</span>} gamePk={gamePk} />
			)}
			<HighlightDialog
				index={queueVidIndex}
				open={open}
				queue={props.queue}
				onClose={() => setOpen(false)}
				url={defaultVideo(dialogMedia).url}
				title={title(dialogMedia)}
				onChange={(dir) => queueUpdate(dir)}
			/>
		</Card>
	);
}

Highlight.defaultProps = {
	loading: false
}

interface HighlightDialogProps {
	index: number;
	url: string;
	title: string;
	open: boolean;
	queue?: Queue;
	onClose: () => void;
	onChange: (dir: number) => void;
}

const HighlightDialog = ({
	title, url, onChange, open, onClose, queue, index
}: HighlightDialogProps) => {
	const settings = useDataStore(SettingsDataStore);
	const respond = useDataStore(RespondDataStore);
	const [autoplay, setAutoplay] = useState(settings.autoplay);
	const updateAutoplay = (setting: boolean) => {
		setAutoplay(setting);
		SettingsDataStore.setAutoplay(setting);
	}

	const atMax = index + 1 >= (queue?.highlights?.length ?? 0);

	const small = RespondDataStore.test(RespondSizes.small);

	return (
		<Dialog open={open} onClose={onClose} maxWidth={'xl'}>
			<DialogTitle>
				<div style={{ display: "flex", flexDirection: small ? "column" : "row" }}>
					<div style={{ flex: 1 }}>
						{title}
						<a href={url} target="_blank" style={{ marginLeft: 10, fontSize: "14px", color: "#ce0f0f" }} rel="noreferrer">[link]</a>
					</div>
					<div style={{ display: "flex", alignItems: "center" }}>
						{(queue?.highlights?.length ?? 0) > 0 && (
							<>
								<FormGroup>
									<FormControlLabel control={<Switch color={"primary"} checked={autoplay} onChange={e => updateAutoplay(e.currentTarget.checked)} />} label="Autoplay" />
								</FormGroup>
								<IconButton onClick={() => onChange(-1)} color={"primary"} disabled={index === 0}>
									<KeyboardArrowLeft />
								</IconButton>
								{index + 1} / {queue?.highlights?.length}
								<IconButton onClick={() => onChange(1)} color={"primary"} disabled={atMax}>
									<KeyboardArrowRight />
								</IconButton>
							</>
						)}
					</div>
				</div>
			</DialogTitle>
			<DialogContent style={{ display: "flex" }}>
				<video controls autoPlay style={{ flex: 1, height: small ? "40vh" : "66vh", maxWidth: "100%" }} src={url} onEnded={() => autoplay && !atMax && onChange(1)} />
			</DialogContent>
			<DialogContent>
				<DialogContentText>
					DISCLAIMER:<br />
					This video is provided by MLBAM and MLB.com and has no affiliation with or connection to Baseball Theater. It has been displayed on your device
					via a public API provided by Major League Baseball.
				</DialogContentText>
			</DialogContent>
		</Dialog>
	)
}

interface PLProps {
	gamePk: string;
	content: React.ReactNode;
}

const PossibleLink = ({ gamePk, content }: PLProps) => {
	const cardHeader = (
		<CardHeader style={{ padding: "0.25rem 0.5rem", borderTop: "1px solid #EEE" }} subheader={content} titleTypographyProps={{
			variant: "button"
		}} />
	);

	return gamePk
		? (
			<a href={SiteRoutes.Game.resolve({ gameId: gamePk })}>
				{cardHeader}
			</a>
		)
		: cardHeader;
};