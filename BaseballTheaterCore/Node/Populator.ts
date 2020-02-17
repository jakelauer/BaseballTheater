import moment = require("moment");
const fs = require('fs');
import Internal_GameSummaryCreator from "@MlbDataServer/Internal_GameSummaryCreator";
import Internal_LiveGameCreator from "@MlbDataServer/Internal_LiveGameCreator";
import { HighlightUtility } from "ClientApp/components/shared/highlight_utility";

export interface PopulatorArgs {
	dateString?: string;
	loopDates?: boolean;
}

class PopulatorInternal {
	private date: moment.Moment;
	private results: { [key: string]: MediaItem[] } = {};
	private allPromises: Promise<any>[] = [];
	public static Instance = new PopulatorInternal();

	public initialize(args: PopulatorArgs) {
		this.date = args.dateString
			? moment(args.dateString, "YYYYMMDD")
			: moment().add(-5, "days");

		this.loadHighlights();
	}

	private async loadHighlights() {
		const today = moment();
		let lastDay = this.date;

		console.log("===start loop===")
		while (lastDay.isBefore(today)) {
			const highlights = await this.loadHighlightsForDate(lastDay);
			const dateString = lastDay.format("YYYYMMDD");
			const jsonResult = JSON.stringify(highlights);
			fs.writeFile("C:\\highlightdata\\" + dateString + ".json", jsonResult, "utf8");
			lastDay = lastDay.add(1, "day");
		}
		console.log("===end loop===");
	}

	private async loadHighlightsForDate(date: moment.Moment) {
		const dateString = date.format("YYYYMMDD");
		const summaries = Internal_GameSummaryCreator.getSummaryCollectionNode(date);

		const data = await summaries;

		if (data.games.game) {
			console.log("games found for " + dateString + ": " + data.games.game.length);
		}

		const allHighlights = [];
		for (const game of data.games.game) {
			const highlights = await this.loadHighlightsForGame(game.game_pk);
			allHighlights.push(...highlights);
		}


		return allHighlights;
	}

	private async loadHighlightsForGame(game_pk: string) {
		console.log(`game: ${game_pk}`);

		const data = await Internal_LiveGameCreator.getGameMediaNode(game_pk);

		let highlights: IHighlightSearchItem[] = [];
		const hasHighlights = !!(data.highlights && data.highlights.highlights && data.highlights.highlights.items);
		console.log(`hasHighlights: ${hasHighlights}`)
		if (data.highlights && data.highlights.highlights && data.highlights.highlights.items) {
			console.log(data.highlights.highlights.items.length);
			highlights = data.highlights.highlights.items.map(highlight => {

				const displayProps = HighlightUtility.getDisplayProps(highlight, false);
				if (displayProps) {
					console.log("has displayprops");
					const matchingCut = highlight.image.cuts.find(a => a.src === displayProps.thumb);
					highlight.image.cuts = [matchingCut];
				}

				return {
					highlight,
					game_pk
				};
			})
		}

		return highlights;
	}
}

interface IHighlightSearchItem {
	highlight: MediaItem,
	game_pk: string
}

export const Populator = PopulatorInternal.Instance;