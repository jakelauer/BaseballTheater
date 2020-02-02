import * as React from "react";
import {LiveGamePlay} from "baseball-theater-engine";
import {Collapse, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import {Strikezone} from "./Strikezone";
import {PitchItem} from "./PitchItem";
import styles from "./PlayItem.module.scss";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {MdVideoLibrary} from "react-icons/all";
import Avatar from "@material-ui/core/Avatar";
import {AuthIntercom, IAuthContext} from "../../../Global/AuthIntercom";
import classNames from "classnames";
import Tooltip from "@material-ui/core/Tooltip";

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
	auth: IAuthContext;
}

export class PlayItem extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			expanded: false,
			auth: AuthIntercom.state
		};
	}

	public componentDidMount(): void
	{
		AuthIntercom.listen(auth => this.setState({auth}));
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
			.map(pe => <PitchItem auth={this.state.auth} key={pe.endTime} pitch={pe}/>);

		const playEventsLength = this.props.play?.playEvents?.length ?? 1;
		const playId = this.props.play.playEvents?.[playEventsLength - 1]?.playId;

		const authed = this.state.auth.levels.includes("Backer");
		const href = authed ? `https://baseballsavant.mlb.com/sporty-videos?playId=${playId}` : "#";
		const avatarClasses = classNames(styles.videoAvatar, {
			[styles.unauthed]: !authed
		});
		const tooltip = (
			<div style={{textAlign: "center", fontSize: "0.8rem"}}>
				<div>Video of play</div>
				{!authed && <i>(Patreon Backers Only)</i>}
			</div>
		);

		return (
			<React.Fragment>
				<ListItem button onClick={this.toggle}>
					<ListItemAvatar>
						{playId &&
                        <Tooltip title={tooltip} arrow>
                            <Avatar className={avatarClasses}>
                                <a target={"_blank"} href={href}
                                   onClick={e =>
								   {
									   e.stopPropagation();
									   if (!authed)
									   {
										   e.preventDefault();
									   }
								   }}>
                                    <MdVideoLibrary/>
                                </a>
                            </Avatar>
                        </Tooltip>
						}
					</ListItemAvatar>
					<ListItemText
						primary={result.event}
						secondary={result.description}
					/>
					<ListItemSecondaryAction>
						<div className={styles.actions}>
							{this.state.expanded ? <ExpandLess/> : <ExpandMore/>}
						</div>
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