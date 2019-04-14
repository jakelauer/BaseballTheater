import {Link} from "react-router-dom";
import {Card} from "antd";
import React = require("react");
import {HighlightUtility, IHighlightDisplay} from "./highlight_utility";
import * as moment from "moment"
import { ISearchResult } from "../Search/search";

interface IHighlightProps
{
	renderDate: boolean;
	highlight: MediaItem | ISearchResult;
	hideScores: boolean;
}

export class Highlight extends React.Component<IHighlightProps, any>
{
	private get highlight()
	{
		return (this.props.highlight as ISearchResult).highlight || (this.props.highlight as MediaItem);
	}

	private get searchResult(): any | null
	{
		const asSearchResult = this.props.highlight as ISearchResult;
		const isSearchResult = !!asSearchResult.highlight;
		return isSearchResult ? asSearchResult : null;
	}

	private getGameLink()
	{
		const dateString = moment(this.highlight.date).format("YYYYMMDD");
		const gameId = this.searchResult ? String(this.searchResult.gameId) : null
		return gameId ? `/game/${dateString}/${gameId}` : "javascript:void(0)";
	}

	public render()
	{
		const displayProps = HighlightUtility.getDisplayProps(this.highlight, this.props.hideScores); //, this.searchResult);

		if (!displayProps)
		{
			return <div/>;
		}

		const thumbStyle = {backgroundImage: `url(${displayProps.thumb})`};

		const links = displayProps.links.map((link, i) =>
		{
			return <a href={link.url} target="_blank" key={i} rel={"noreferrer"}>{link.label}</a>;
		});

		const cover = <a href={displayProps.videoUrl} target={`_blank`} rel={"noreferrer"}>
			<div className={`thumb`} style={thumbStyle}/>
		</a>;

		const dateString = moment(this.highlight.date).format("MMM D, YYYY");
		const dateRendered = this.props.renderDate
			? <Link className={`date`} to={this.getGameLink()}>
				{dateString}
			</Link>
			: null;
			
		const title = <React.Fragment>
			{displayProps.headline}
			<br/>
			{dateRendered}
		</React.Fragment>;

		return (
			<div className={`highlight`}>
				<Card
					cover={cover}
					actions={links}
				>
					<Card.Meta
						title={title}
					/>
				</Card>
			</div>
		);
	}
}
