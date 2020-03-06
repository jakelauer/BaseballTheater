import fs from "fs";
import path from "path";
import {IHighlightSearchItem} from "../../baseball-theater-engine/contract";

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
	private allSearchable: string[] = [];
	private loadedFilesSizes: { [key: string]: number } = {};

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

		const files = fs.readdirSync("C:/highlightdata");
		let totalLoaded = 0;
		const filesLength = files.length;
		console.log(`${filesLength} files`);
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
		const upperWords = query.text.toUpperCase().replace(/\W/g, '').split(" ");

		let matches = this.allHighlights.filter(h =>
		{
			const keywords = h.highlight.keywordsAll.map(k => k.value + " " + k.displayName);

			const checkAgainst = `${h.highlight?.headline ?? ""} ${h.highlight?.blurb ?? ""} ${h.highlight?.kicker ?? ""} ${h.highlight?.description ?? ""} ${keywords}`
				.replace(/\W/g, '')
				.toUpperCase();

			let matched = upperWords.every(word => checkAgainst.includes(word));

			if (query.gameIds)
			{
				matched = matched && query.gameIds.includes(h.game_pk);
			}

			return matched;
		});

		if (query.gameIds)
		{
			matches = matches.filter(a => query.gameIds.includes(a.game_pk));
		}

		return matches.slice(page * 20, (page + 1) * 20);
	}
}

export const Search = SearchInternal.Instance;