import fs from "fs";
import path from "path";
import {IHighlightSearchItem} from "../../baseball-theater-engine/contract";
import {MlbDataServer} from "baseball-theater-engine";
import {IFullVideoSearchQueryParams} from "../../baseball-theater-engine/contract/FullVideoSearch";

interface ISearchable
{
	index: number;
	searchText: string;
	game_pk: number;
}

class SearchInternal
{
	public static Instance = new SearchInternal();
	private allHighlights: IHighlightSearchItem[] = [];
	private allSearchable: ISearchable[] = [];
	private loadedPlaybackIds: string[] = [];
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

		this.allSearchable = this.allHighlights.map((h, i) =>
		{
			const keywords = h.highlight.keywordsAll.map(k => k.value + " " + k.displayName);
			const searchText = `${h.highlight?.headline ?? ""} ${h.highlight?.blurb ?? ""} ${h.highlight?.kicker ?? ""} ${h.highlight?.description ?? ""} ${keywords}`
				.replace(/\W/g, '')
				.toUpperCase();

			return {
				game_pk: h.game_pk,
				index: i,
				searchText
			};
		});

		const finalCount = this.allHighlights.length;

		console.log(`Loaded ${finalCount - startingCount} new highlights.`);
	}

	private loadIntoMemory()
	{
		console.log("Loading highights at " + Date.now());

		const startingCount = this.allHighlights.length;

		const files = fs.readdirSync("C:/highlightdata").filter(f => f.includes("2019") || f.includes("2020"));
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
							const newHighlights = fileHighlights.filter(nh => this.loadedPlaybackIds.indexOf(nh.highlight.mediaPlaybackId) === -1);

							this.allHighlights.push(...newHighlights);
							this.loadedPlaybackIds.push(...newHighlights.map(h => h.highlight.mediaPlaybackId));

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
		const upperWords = query.text.toUpperCase().replace(/[\W_]/g, '').split(" ");

		let start = this.allSearchable;
		let matches = [];

		if (query.gameIds)
		{
			start = start.filter(a => query.gameIds.includes(a.game_pk));
		}

		matches = start.filter(h =>
		{
			let matched = upperWords.every(word => h.searchText.includes(word));

			return matched;
		});

		matches = matches.sort((a, b) =>
		{
			return b.game_pk - a.game_pk;
		})

		return matches.slice(page * 20, (page + 1) * 20).map(m => this.allHighlights[m.index]);
	}

	public async doFullSearch(params: IFullVideoSearchQueryParams)
	{
		const MLB = new MlbDataServer(undefined);
		return await MLB.fullVideoSearch(params);
	}
}

export const Search = SearchInternal.Instance;