﻿namespace Theater
{
	interface ILink
	{
		url: string;
		label: string;
	}

	Vue.component("highlight",
		{
			template: $("template#highlight").html(),
			props: ["highlight"],
			methods: {
				getLinks: (highlight: IHighlight) => HighlightModule.getLinks(highlight),
				getDefaultUrl: (highlight: IHighlight) => HighlightModule.getDefaultUrl(highlight),
				getTitle: (highlight: IHighlight) => HighlightModule.getTitle(highlight),
				getDefaultThumb: (highlight: IHighlight) => HighlightModule.getDefaultThumb(highlight),
				getMlbLink: (highlight: IHighlight) => HighlightModule.getMlbLink(highlight)
			}
		});

	module HighlightModule
	{
		export function getDefaultUrl(highlight: IHighlight)
		{
			const links = getLinks(highlight);

			const link1800 = links.find((value) =>
			{
				return !!value.url.match("1800K");
			});

			if (link1800)
			{
				return link1800.url;
			}

			return links[links.length - 1].url;
		}

		export function getLinks(game: IHighlight)
		{
			const qkRegex = /(\d{4}K)/;
			const links = game.url;
			let q1200k: ILink = null;

			// For some reason, Safari doesn't like this particular 
			// variable when it's a 'let' when it's minified. 
			// ReSharper disable once VariableCanBeMadeLet
			for (var link of links)
			{
				const matches = link.__text.match(qkRegex);
				if (matches && matches.length > 0)
				{
					q1200k = {
						url: link.__text.replace("http:", location.protocol),
						label: "low"
					};
				}
			}

			const validLinks: ILink[] = [];

			if (q1200k !== null)
			{
				const q1800K = {
					url: q1200k.url.replace(qkRegex, "1800K").replace("http:", location.protocol),
					label: "mid"
				};

				const q2500K = {
					url: q1200k.url.replace(qkRegex, "2500K").replace("http:", location.protocol),
					label: "high"
				};

				validLinks.push(q1200k, q1800K, q2500K);
			}

			return validLinks;
		}


		export function getTitle(highlight: IHighlight)
		{
			if (highlight.recap)
			{
				return "Recap";
			}

			if (highlight.condensed)
			{
				return "Condensed Game";
			}

			const teamCode = MlbDataServer.Teams.TeamIdList[highlight.team_id];
			return `<span class='team'>${teamCode.toUpperCase()}</span> <span class='title'>${highlight.headline}</span>`;
		}

		export function getMlbLink(highlight: IHighlight)
		{
			/*var $playCover = $(event.currentTarget);
			var $video = $playCover.siblings("video");
			($video[0] as HTMLVideoElement).play();*/

			//const cId = highlight.id;
			//const mlbLink = `https://www.mlb.com/video/c-${cId}`;
			return getDefaultUrl(highlight);
		}

		export function getDefaultThumb(highlight: IHighlight)
		{
			const thumbFinal = highlight.thumbnails.thumb[1].__text;
			return thumbFinal.replace("http:", location.protocol);
		}
	}
}