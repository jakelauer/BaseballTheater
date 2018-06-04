import React = require("react");
import {Utility} from "@Utility/index";
import {IHighlight, IHighlightsCollection} from "../../../MlbDataServer/Contracts";
import {Highlight} from "../../shared/highlight";

interface IHighlightsProps
{
	highlightsCollection: IHighlightsCollection | null;
	hideScores: boolean;
}

interface IHighlightsState
{
	allHighlights: IHighlight[];
	specialHighlights: IHighlight[];
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
		const highlightsCollection = this.props.highlightsCollection;

		if (highlightsCollection && highlightsCollection.highlights && highlightsCollection.highlights.media)
		{
			let highlights: IHighlight[];
			let allHighlights: IHighlight[];
			let specialHighlights: IHighlight[];

			for (let highlight of highlightsCollection.highlights.media)
			{
				highlight.isPlaying = false;
			}

			highlights = Utility.Data.forceArray(highlightsCollection.highlights.media);
			highlights.sort((a, b) =>
			{
				const aIsRecap = a.recap ? -1 : 0;
				const bIsRecap = b.recap ? -1 : 0;
				const aIsCondensed = a.condensed ? -1 : 0;
				const bIsCondensed = b.condensed ? -1 : 0;
				const idOrder = a.id - b.id;

				return (aIsRecap - bIsRecap) || (aIsCondensed - bIsCondensed) || idOrder;
			});

			specialHighlights = highlights.filter((highlight) =>
			{
				return highlight.recap || highlight.condensed;
			});

			allHighlights = highlights.filter(highlight =>
			{
				return !highlight.recap && !highlight.condensed;
			});

			this.setState({
				allHighlights,
				specialHighlights
			});
		}
	}

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
