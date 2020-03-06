import fs from "fs";
import path from "path";
import {IHighlightSearchItem} from "../../baseball-theater-engine/contract";
import FlexSearch from "flexsearch";

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
	private loadedFilesSizes: { [key: string]: number } = {};
	private flexSearch = FlexSearch.create({
		profile: "fast",
		doc: {
			id: "highlight:guid",
			field: [
				"highlight:headline",
				"highlight:description",
				"highlight:blurb",
				"highlight:keywordsAll:displayName",
				"highlight:keywordsAll:value"
			]
		}
	});

	public initialize()
	{
		this.loadIntoMemory();
	}

	private loadTimer = () =>
	{
		setTimeout(() => this.loadIntoMemory(), 1000 * 60 * 10);
	};

	private afterAllLoaded(startingCount: number)
	{
		this.allHighlights = this.allHighlights.sort((a, b) =>
		{
			return b.game_pk - a.game_pk;
		});

		const finalCount = this.allHighlights.length;

		console.log(`Loaded ${finalCount - startingCount} new highlights.`);
	}

	private loadIntoMemory()
	{
		console.log("Loading highights at " + Date.now());

		const startingCount = this.allHighlights.length;

		const files = fs.readdirSync("C:/highlightdata").filter(a => a.includes("2020") || a.includes("2019"));
		let totalLoaded = 0;
		const filesLength = files.length;
		files.reverse().forEach((file, i) =>
		{
			try
			{
				const filePath = path.join("C:/highlightdata", file);
				const stats = fs.statSync(filePath);
				const fileSizeInBytes = stats["size"];
				const knownFileSizeBytes = this.loadedFilesSizes[filePath] ?? -1;
				if (knownFileSizeBytes !== fileSizeInBytes)
				{
					fs.readFile(filePath, (err, fileJson) =>
					{
						totalLoaded++;

						if (err)
						{
							console.error(err);
						}
						else
						{
							const fileHighlights = JSON.parse(fileJson.toString()) as IHighlightSearchItem[];
							const newHighlights = fileHighlights.filter(h => this.allHighlights.indexOf(h) === -1);

							this.flexSearch.add(newHighlights);

							this.allHighlights.push(...newHighlights);

							this.loadedFilesSizes[filePath] = fileSizeInBytes;

							console.log(`Loaded and indexed ${filePath}. ${totalLoaded} of ${filesLength}`);
						}


						if (totalLoaded === filesLength)
						{
							this.afterAllLoaded(startingCount);
						}

					});
				}
				else
				{
					totalLoaded++;
				}
			}
			catch (e)
			{
				console.error(e);
			}
		});


		this.loadTimer();
	}

	public async doSearch(query: { text: string, gameIds?: number[] }, page = 0)
	{
		let matches = await this.flexSearch.search(query.text, {
			sort: (a: IHighlightSearchItem, b: IHighlightSearchItem) => b.game_pk - a.game_pk
		} as any);

		let highlightMatches = matches as IHighlightSearchItem[];

		if (query.gameIds)
		{
			highlightMatches = highlightMatches.filter(a => query.gameIds.includes(a.game_pk));
		}

		return highlightMatches.slice(page * 20, (page + 1) * 20);
	}
}

export const Search = SearchInternal.Instance;