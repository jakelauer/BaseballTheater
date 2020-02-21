import * as React from "react";
import {LiveGamePlay} from "baseball-theater-engine";
import {Collapse, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import {Strikezone} from "./Strikezone";
import {PitchItem} from "./PitchItem";
import styles from "./PlayItem.module.scss";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {MdVideoLibrary} from "react-icons/all";
import Avatar from "@material-ui/core/Avatar";
import {AuthDataStore, BackerType, IAuthContext} from "../../../Global/AuthDataStore";
import classNames from "classnames";
import Tooltip from "@material-ui/core/Tooltip";
import {GameDataStoreContext} from "./GameDataStore";

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
			auth: AuthDataStore.state
		};
	}

	public componentDidMount(): void
	{
		AuthDataStore.listen(auth => this.setState({auth}));
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

		const authed = AuthDataStore.hasLevel(BackerType.ProBacker);
		const href = authed ? `https://baseballsavant.mlb.com/sporty-videos?playId=${playId}` : "#";
		const avatarClasses = classNames(styles.videoAvatar, {
			[styles.unauthed]: !authed
		});
		const tooltip = (
			<div style={{textAlign: "center", fontSize: "0.8rem"}}>
				<div>Video of play</div>
			</div>
		);

		return (
			<GameDataStoreContext.Consumer>
				{gameDataStore => (<>
					<ListItem button onClick={this.toggle}>
						<ListItemAvatar>
							{playId &&
                            <Tooltip title={tooltip} arrow enterTouchDelay={0}>
                                <Avatar className={avatarClasses}>
                                    <a target={"_blank"} href={href}
                                       onClick={e =>
									   {
										   e.stopPropagation();
										   if (!authed)
										   {
											   gameDataStore.showUpsell(BackerType.ProBacker);
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
				</>)}
			</GameDataStoreContext.Consumer>
		);
	}
}