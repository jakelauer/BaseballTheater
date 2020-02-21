import moment = require("moment");
import {MediaItem} from "../baseball-theater-engine/contract";
import {MlbDataServer} from "../baseball-theater-engine";

const fs = require('fs');

export interface PopulatorArgs
{
	dateString?: string;
	loopDates?: boolean;
}

class PopulatorInternal
{
	private date: moment.Moment;
	private results: { [key: string]: MediaItem[] } = {};
	private allPromises: Promise<any>[] = [];
	public static Instance = new PopulatorInternal();

	public initialize(args: PopulatorArgs)
	{
		this.date = args.dateString
			? moment(args.dateString, "YYYYMMDD")
			: moment().add(-5, "days");

		this.loadHighlights();
	}

	private async loadHighlights()
	{
		const today = moment();
		let lastDay = this.date;

		console.log("===start loop===")
		while (lastDay.isBefore(today))
		{
			const highlights = await this.loadHighlightsForDate(lastDay);
			const dateString = lastDay.format("YYYYMMDD");
			const jsonResult = JSON.stringify(highlights);
			console.log(jsonResult);
			fs.writeFile("C:\\highlightdata\\" + dateString + ".json", jsonResult, {
				encoding: "utf8"
			}, () =>
			{
			});
			lastDay = lastDay.add(1, "day");
		}
		console.log("===end loop===");
	}

	private async loadHighlightsForDate(date: moment.Moment)
	{
		const allHighlights: IHighlightSearchItem[] = [];

		const MLB = new MlbDataServer();
		const data = await MLB.getScoreboardNode(date);

		let promises: Promise<any>[] = [];
		data.dates.forEach(date =>
		{
			date.games.forEach(game =>
			{
				promises.push(this.loadHighlightsForGame(MLB, game.gamePk).then(highlights =>
				{
					allHighlights.push(...highlights)
				}));
			});
		});

		await Promise.all(promises);

		return allHighlights;
	}

	private async loadHighlightsForGame(MLB: MlbDataServer, game_pk: string)
	{
		const data = await MLB.getGameMediaNode(game_pk);

		let highlights: IHighlightSearchItem[] = [];
		const hasHighlights = !!(data.highlights && data.highlights.highlights && data.highlights.highlights.items);
		console.log(`hasHighlights: ${hasHighlights}`)
		if (data.highlights && data.highlights.highlights && data.highlights.highlights.items)
		{
			console.log(data.highlights.highlights.items.length);
			highlights = data.highlights.highlights.items.map(highlight =>
			{
				if (highlight && highlight.image && highlight.image.cuts)
				{
					const images = highlight.image.cuts;

					const matchingCut = images.find(a => a.aspectRatio === "16:9" && a.width < 1000 && a.width > 500)
						|| images.find(a => a.aspectRatio === "16:9")
						|| images[0];

					highlight.image.cuts = [matchingCut];

					const final = {
						highlight,
						game_pk
					};

					console.log(final);

					return final;
				}
			}).filter(a => a !== undefined);
		}

		return highlights;
	}
}

interface IHighlightSearchItem
{
	highlight: MediaItem,
	game_pk: string
}

export const Populator = PopulatorInternal.Instance;