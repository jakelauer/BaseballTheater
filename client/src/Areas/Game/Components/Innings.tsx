import {IHalfInning} from "../Utils/PlayUtils";
import * as React from "react";
import {PlayItem} from "./PlayItem";
import {StringUtils} from "../../../Utility/StringUtils";
import {Collapse, List, ListItem, ListItemText} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

export type HalfInnings = { [key: string]: IHalfInning };

export interface IHalfInningProps
{
	halfInning: IHalfInning;
	defaultOpen: boolean;
	isLive?: boolean;
	isCurrentHalfInning: boolean;
}

export const HalfInning = ({halfInning, defaultOpen, isLive, isCurrentHalfInning}: IHalfInningProps) =>
{
	const [open, setOpen] = React.useState(defaultOpen);
	let playsSorted = halfInning?.plays ?? [];
	if (isLive)
	{
		playsSorted = playsSorted.filter(p => p.playEvents.length > 0);
	}

	const renderedPlays = playsSorted.map((p, i) => (
		<PlayItem
			play={p}
			key={i}
			showOtherEvents={true}
			defaultExpanded={i === playsSorted.length - 1 && isCurrentHalfInning}
		/>
	));

	if (isLive)
	{
		renderedPlays.reverse();
	}

	const halfLabel = `${StringUtils.toProperCase(halfInning.halfInning)} ${halfInning.inningNumber}`;

	const handleClick = () => setOpen(!open);

	return (
		<React.Fragment>
			<ListItem button={!isLive as true} onClick={handleClick}>
				<ListItemText primary={<h4 style={{margin: "0.25rem"}}>{halfLabel}</h4>}/>
				{!isLive && (
					<>
						{open ? <ExpandLess/> : <ExpandMore/>}
					</>
				)}
			</ListItem>
			{isLive ?
				(renderedPlays)
				: (
					<Collapse in={open}>
						{renderedPlays}
					</Collapse>
				)}
		</React.Fragment>
	);
};


export interface IInningProps
{
	halfInnings: HalfInnings;
	keysSorted: string[];
	isLive?: boolean;
	isCurrentInning: boolean;
}

export class Inning extends React.Component<IInningProps>
{
	public render()
	{
		const renderedHalfInnings = this.props.keysSorted.map((k, i) =>
			<HalfInning
				isLive={this.props.isLive}
				key={k}
				halfInning={this.props.halfInnings[k]}
				defaultOpen={true}
				isCurrentHalfInning={this.props.isCurrentInning && i === this.props.keysSorted.length - 1}
			/>
		);

		return (
			<List style={{flex: 1}}>
				{renderedHalfInnings}
			</List>
		);
	}
}