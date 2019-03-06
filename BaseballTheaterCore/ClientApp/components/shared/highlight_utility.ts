import {Utility} from "@Utility/index";
import * as moment from "moment"

enum HighlightThumbQuality
{
	Low,
	Med,
	High,
}

export interface IHighlightDisplay
{
	thumb: string | null;
	links: ILink[];
	videoUrl: string;
	teamId: string;
	headline: string;
	overrideTitle: string | null;
	recap: boolean;
	condensed: boolean;
}

export interface ILink
{
	url: string;
	label: string;
}

export class HighlightUtility
{
	public static isRecap(highlight: MediaItem)
	{
		return highlight.keywordsAll.some(a => a.value.toLocaleLowerCase().includes("recap"));
	}

	public static isCondensed(highlight: MediaItem)
	{
		return highlight.keywordsAll.some(a => a.value.toLocaleLowerCase().includes("condensed"));
	}

	public static getDisplayProps(highlight: MediaItem, hideScores: boolean): IHighlightDisplay | null
	{
		let displayProps: IHighlightDisplay | null = {
			thumb: "",
			links: [],
			videoUrl: "",
			overrideTitle: null,
			headline: "",
			teamId: "",
			recap: false,
			condensed: false
		};

		if (highlight)
		{
			const images = highlight.image.cuts;
			displayProps.thumb = images.find(a => a.aspectRatio === "16:9" && a.width < 1000 && a.width > 500).src;
			displayProps.links = highlight.playbacks.filter(a => a.name.includes("FLASH")).map(item => ({
				url: item.url,
				label: item.name.match(/[0-9]+K/gi)[0]
			}));
			displayProps.videoUrl = highlight.playbacks.find(a => a.url.includes("1800K")).url
				|| highlight.playbacks.find(a => a.url.includes("mp4")).url;

			const isRecap = HighlightUtility.isRecap(highlight);
			const isCondensed = HighlightUtility.isCondensed(highlight);

			displayProps.recap = isRecap;
			displayProps.condensed = isCondensed;

			if (isRecap)
			{
				displayProps.overrideTitle = "Recap";
			}

			if (isCondensed)
			{
				displayProps.overrideTitle = "Condensed Game";
			}

			displayProps.headline = (isRecap && hideScores) ? "Recap" : highlight.headline;
		}
		else
		{
			displayProps = null;
		}

		return displayProps;
	}
}
