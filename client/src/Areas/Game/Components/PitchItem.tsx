import * as React from "react";
import {ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import styles from "./PitchItem.module.scss";
import {LiveGamePlayEvent} from "baseball-theater-engine";

interface IPitchItemProps
{
	pitch: LiveGamePlayEvent;
}

interface DefaultProps
{
}

type Props = IPitchItemProps & DefaultProps;
type State = IPitchItemState;

interface IPitchItemState
{
}

export class PitchItem extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {};
	}

	public render()
	{
		const pitch = this.props.pitch;
		if (!(pitch?.details?.call))
		{
			return null;
		}

		const {
			breaks,
			startSpeed
		} = pitch.pitchData;

		const secondary = `${startSpeed}mph ${pitch.details.type.description} [${breaks.spinRate} Spin Rate]`;

		return (
			<ListItem>
				<ListItemAvatar className={styles.pitchNumber}>
					<span style={{backgroundColor: pitch.details.ballColor}}>{pitch.pitchNumber}</span>
				</ListItemAvatar>
				<ListItemText
					primary={pitch.details.description}
					secondary={secondary}
				/>
			</ListItem>
		);
	}
}