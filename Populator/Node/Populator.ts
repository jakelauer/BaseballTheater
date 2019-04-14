import moment = require("moment");
import Internal_GameSummaryCreator from "@MlbDataServer/Internal_GameSummaryCreator";
import Internal_LiveGameCreator from "@MlbDataServer/Internal_LiveGameCreator";

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
            : moment();

        this.loadHighlights();
    }

    private loadHighlights() {
        const today = moment();
        let lastDay = this.date;

        while (lastDay.isBefore(today))
        {
            this.loadHighlightsForDate(lastDay);
            lastDay = lastDay.add(1, "day");
        }

        Promise.all(this.allPromises).then(() => {
            console.log(Object.keys(this.results).length);
        }).catch(e => console.log("error"))
    }

    private loadHighlightsForDate(date: moment.Moment) {
        const dateString = date.format("YYYYMMDD");
        this.results[date.format("YYYYMMDD")] = [];
        const summaries = Internal_GameSummaryCreator.getSummaryCollection(date);
        summaries.then(data => {
            data.games.game.forEach(game => this.loadHighlightsForGame(game.game_pk, dateString))
        }).catch(e => console.log("error"));
    }

    private loadHighlightsForGame(game_pk: string, dateString: string) {
        const p = Internal_LiveGameCreator.getGameMedia(game_pk).then(data => {
            if (data.highlights && data.highlights.highlights && data.highlights.highlights.items) {
                this.results[dateString].push(...data.highlights.highlights.items);
            }
        }).catch(e => console.log("error"));

        this.allPromises.push(p);
    }
}

export const Populator = PopulatorInternal.Instance;