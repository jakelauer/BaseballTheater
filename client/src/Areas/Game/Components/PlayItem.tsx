import * as React from "react";
import {LiveGamePlay} from "baseball-theater-engine";
import {Collapse, List, ListItem, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import {Strikezone} from "./Strikezone";
import {Simulate} from "react-dom/test-utils";
import {PitchItem} from "./PitchItem";
import styles from "./PlayItem.module.scss";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

interface IPlayItemProps
{
	play: LiveGamePlay;
}

interface DefaultProps
{
}

type Props = IPlayItemProps & DefaultProps;
type State = IPlayItemState;

interface IPlayItemState
{
	expanded: boolean;
}

export class PlayItem extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			expanded: false
		};
	}

	private toggle = () => this.setState({
		expanded: !this.state.expanded
	});

	public render()
	{
		const {
			about,
			result,
			pitchIndex,
			playEvents
		} = this.props.play;

		const pitchItems = pitchIndex
			.map(pi => playEvents[pi])
			.map(pe => <PitchItem pitch={pe}/>);


		return (
			<React.Fragment>
				<ListItem button onClick={this.toggle}>
					<ListItemText
						primary={result.event}
						secondary={result.description}
					/>
					<ListItemSecondaryAction>
						{this.state.expanded ? <ExpandLess/> : <ExpandMore/>}
					</ListItemSecondaryAction>
				</ListItem>
				<Collapse in={this.state.expanded} className={styles.playDetails}>
					<div className={styles.pitches}>
						<Strikezone play={this.props.play}/>
						<List>
							{pitchItems}
						</List>
					</div>
				</Collapse>
			</React.Fragment>
		);
	}
}