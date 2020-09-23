import * as React from "react";
import {LiveGamePlay} from "baseball-theater-engine";
import {Collapse, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import {Strikezone} from "./Strikezone";
import {PitchItem} from "./PitchItem";
import styles from "./PlayItem.module.scss";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {MdInfoOutline, MdVideoLibrary} from "react-icons/all";
import Avatar from "@material-ui/core/Avatar";
import {AuthDataStore, BackerType, IAuthContext} from "../../../Global/AuthDataStore";
import classNames from "classnames";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";
import {UpsellDataStore} from "./UpsellDataStore";
import {StringUtils} from "../../../Utility/StringUtils";

interface IPlayItemProps
{
	play: LiveGamePlay;
	showOtherEvents: boolean;
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
			play,
			showOtherEvents
		} = this.props;

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
		const playVideoEnabled = moment().isAfter(moment(about.endTime).add(36, "hour"));
		const href = authed && playVideoEnabled ? `https://baseballsavant.mlb.com/sporty-videos?playId=${playId}` : "#";
		const avatarClasses = classNames(styles.videoAvatar, {
			[styles.unauthed]: !authed
		});

		let label = "Video of play";
		if (!playVideoEnabled)
		{
			label += " (not available until 2 days after game)";
		}
		const tooltip = (
			<div style={{textAlign: "center", fontSize: "0.8rem"}}>
				<div>{label}</div>
			</div>
		);

		const nonPitchPlays = play.playEvents.filter(pe => !pe.isPitch);

		const finalHit = play.playEvents.filter(a => !!a.hitData)?.reverse()?.[0];

		return (
			<>
				{showOtherEvents && nonPitchPlays.map(pe => (
					<div className={styles.nonPitchEvent}>
						<MdInfoOutline className={styles.nonPitchEventIcon}/>
						<div>{pe.details.description}</div>
					</div>
				))}
				<ListItem button onClick={this.toggle}>
					<ListItemAvatar>
						{playId &&
                        <Tooltip title={tooltip} arrow enterTouchDelay={0}>
                            <Avatar className={avatarClasses}>
                                <a target={"_blank"} href={href}
                                   onClick={e =>
								   {
									   e.stopPropagation();
									   if (!authed || !playVideoEnabled)
									   {
										   if (!authed)
										   {
											   UpsellDataStore.open(BackerType.ProBacker);
										   }
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
						primary={result.event || `${play.matchup.batter.fullName} hits against ${play.matchup.pitcher.fullName}`}
						secondary={result.description}
					/>
					<ListItemSecondaryAction>
						<div className={styles.actions}>
							{this.state.expanded ? <ExpandLess/> : <ExpandMore/>}
						</div>
					</ListItemSecondaryAction>
				</ListItem>
				<Collapse in={this.state.expanded} className={styles.playDetails}>
					<div className={styles.pitcher}>Pitching: {play.matchup.pitcher.fullName}</div>
					<div className={styles.pitches}>
						<Strikezone play={this.props.play}/>
						<List>
							{pitchItems}
						</List>
					</div>
					{finalHit && (
						<List>
							<ListItem>EV: {finalHit.hitData.launchSpeed} MPH</ListItem>
							<ListItem>Launch Angle: {finalHit.hitData.launchAngle}°</ListItem>
							<ListItem>Distance: {finalHit.hitData.totalDistance}'</ListItem>
							<ListItem>Hardness: {StringUtils.toProperCase(finalHit.hitData.hardness)}</ListItem>
							<ListItem>Type: {StringUtils.toProperCase(finalHit.hitData.trajectory.replace("_", " "))}</ListItem>
						</List>
					)}
				</Collapse>
			</>
		);
	}
}