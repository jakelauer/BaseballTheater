import React = require("react");
import {Utility} from "@Utility/index";
import {Highlight} from "../../shared/highlight";
import {HighlightUtility} from "../../shared/highlight_utility";
import moment = require("moment");

interface IHighlightsProps
{
	gameMedia: GameMedia | null;
	hideScores: boolean;
}

interface IHighlightsState
{
	allHighlights: MediaItem[];
	specialHighlights: MediaItem[];
}

export class Highlights extends React.Component<IHighlightsProps, IHighlightsState>
{
	constructor(props: IHighlightsProps)
	{
		super(props);

		this.state = {
			allHighlights: [],
			specialHighlights: []
		}
	}

	public componentDidMount(): void
	{
		this.process();
	}

	private process()
	{
		const gameMedia = this.props.gameMedia;

		if (gameMedia && gameMedia.highlights && gameMedia.highlights.highlights && gameMedia.highlights.highlights.items)
		{
			const unfilteredItems = [...gameMedia.highlights.highlights.items];
			if (gameMedia.media && gameMedia.media.epg && gameMedia.media.epg.length > 0)
			{
				gameMedia.media.epg.forEach(e => unfilteredItems.push(...e.items));
			}
			
			const items = unfilteredItems.filter(a => a.type === "video");

			items.sort((a, b) =>
			{
				const aIsRecap = HighlightUtility.isRecap(a) ? -1 : 0;
				const bIsRecap = HighlightUtility.isRecap(b) ? -1 : 0;
				const aIsCondensed = HighlightUtility.isCondensed(a) ? -1 : 0;
				const bIsCondensed = HighlightUtility.isCondensed(b) ? -1 : 0;
				const aDate = moment(a.date);
				const bDate = moment(b.date);
				const dateOrder = aDate.isBefore(bDate) ? -1 : 1;

				return (aIsRecap - bIsRecap) || (aIsCondensed - bIsCondensed) || dateOrder;
			});

			this.setState({
				allHighlights: items.filter(a => !HighlightUtility.isRecap(a) && !HighlightUtility.isCondensed(a)),
				specialHighlights: items.filter(a => HighlightUtility.isRecap(a) || HighlightUtility.isCondensed(a))
			});
		}
	}

	// private process()
	// {
	// 	const highlightsCollection = this.props.highlightsCollection;
	//
	// 	if (highlightsCollection && highlightsCollection.highlights && highlightsCollection.highlights.media)
	// 	{
	// 		let highlights: IHighlight[];
	// 		let allHighlights: IHighlight[];
	// 		let specialHighlights: IHighlight[];
	//
	// 		for (let highlight of highlightsCollection.highlights.media)
	// 		{
	// 			highlight.isPlaying = false;
	// 		}
	//
	// 		highlights = Utility.Data.forceArray(highlightsCollection.highlights.media);
	// 		highlights.sort((a, b) =>
	// 		{
	// 			const aIsRecap = a.recap ? -1 : 0;
	// 			const bIsRecap = b.recap ? -1 : 0;
	// 			const aIsCondensed = a.condensed ? -1 : 0;
	// 			const bIsCondensed = b.condensed ? -1 : 0;
	// 			const idOrder = a.id - b.id;
	//
	// 			return (aIsRecap - bIsRecap) || (aIsCondensed - bIsCondensed) || idOrder;
	// 		});
	//
	// 		specialHighlights = highlights.filter((highlight) =>
	// 		{
	// 			return highlight.recap || highlight.condensed;
	// 		});
	//
	// 		allHighlights = highlights.filter(highlight =>
	// 		{
	// 			return !highlight.recap && !highlight.condensed;
	// 		});
	//
	// 		this.setState({
	// 			allHighlights,
	// 			specialHighlights
	// 		});
	// 	}
	// }

	public render()
	{
		const allHighlights = this.state.allHighlights;
		const specialHighlights = this.state.specialHighlights;

		if (allHighlights.length === 0)
		{
			return (<div/>);
		}

		return (
			<div className={`highlights-container`}>
				{specialHighlights && specialHighlights.length > 0 &&
                <div className={`special-highlights`}>
					{
						specialHighlights.map((highlight) => (
							<Highlight hideScores={this.props.hideScores} renderDate={false} key={highlight.id} highlight={highlight}/>
						))
					}
                </div>
				}

				<div className={`all-highlights`}>
					{
						allHighlights.map((highlight) => (
							<Highlight hideScores={this.props.hideScores} renderDate={false} key={highlight.id} highlight={highlight}/>
						))
					}
				</div>
			</div>
		);
	}
}
