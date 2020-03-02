import fs from "fs";
import path from "path";
import {IHighlightSearchItem} from "../../baseball-theater-engine/contract";
import Fuse from 'fuse.js';

interface IFuseHighlight
{
	index: number;
	searchText: string;
	game_pk: number;
}

class SearchInternal
{
	public static Instance = new SearchInternal();
	private allHighlights: IHighlightSearchItem[] = [];
	private highlightsSearchable: IFuseHighlight[] = [];
	private loadedFilesSizes: { [key: string]: number } = {};

	public initialize()
	{
		this.loadIntoMemory();
	}

	private loadTimer = () =>
	{
		setTimeout(() => this.loadIntoMemory(), 1000 * 60 * 10);
	};

	private loadIntoMemory()
	{
		console.log("Loading highights at " + Date.now());

		const startingCount = this.allHighlights.length;

		const files = fs.readdirSync("C:/highlightdata");
		files.reverse().forEach(file =>
		{
			try
			{
				const filePath = path.join("C:/highlightdata", file);
				const stats = fs.statSync(filePath);
				const fileSizeInBytes = stats["size"];
				const knownFileSizeBytes = this.loadedFilesSizes[filePath] ?? -1;
				if (knownFileSizeBytes !== fileSizeInBytes)
				{
					console.log(`Loading ${filePath}`);
					const fileJson = fs.readFileSync(filePath);
					const fileHighlights = JSON.parse(fileJson.toString()) as IHighlightSearchItem[];
					const newHighlights = fileHighlights.filter(h => this.allHighlights.indexOf(h) === -1);
					this.allHighlights.push(...newHighlights);

					this.loadedFilesSizes[filePath] = fileSizeInBytes;
				}
			}
			catch (e)
			{
				console.error(e);
			}
		});

		this.highlightsSearchable = this.allHighlights.map((h: IHighlightSearchItem, i) => ({
			index: i,
			searchText: `${h.highlight.title} ${h.highlight.description} ${h.highlight.date} ${h.highlight.blurb}`,
			game_pk: h.game_pk
		}));

		const finalCount = this.highlightsSearchable.length;
		console.log(`Loaded ${finalCount - startingCount} new highlights.`);

		this.loadTimer();
	}

	public doSearch(query: { text: string, gameIds?: number[] }, page = 0)
	{
		const fuse = new Fuse(this.highlightsSearchable, {
			sort: true,
			threshold: 0.2,
			distance: 10,
			minMatchCharLength: 2,
			keys: [
				"searchText"
			]
		});

		const matches = fuse.search(query.text);

		let trueMatches = matches.map(m => this.allHighlights[m.index]);

		if (query.gameIds)
		{
			trueMatches = trueMatches.filter(a => query.gameIds.includes(a.game_pk));
		}

		return trueMatches.slice(page * 20, (page + 1) * 20);
	}
}

export const Search = SearchInternal.Instance;