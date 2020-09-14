import * as React from "react";
import {ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import styles from "./PitchItem.module.scss";
import {LiveGamePlayEvent} from "baseball-theater-engine";
import {MdVideoLibrary} from "react-icons/all";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import classNames from "classnames";
import {AuthDataStore, BackerType, IAuthContext} from "../../../Global/AuthDataStore";
import Tooltip from "@material-ui/core/Tooltip";
import {GameDataStoreContext} from "./GameDataStore";
import moment from "moment";
import {UpsellDataStore} from "./UpsellDataStore";

interface IPitchItemProps
{
	pitch: LiveGamePlayEvent;
	auth: IAuthContext;
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

		let secondary: React.ReactNode = null;
		if (pitch.pitchData && pitch.details?.type)
		{
			const {
				breaks,
				startSpeed
			} = pitch.pitchData;

			secondary = (
				<div style={{paddingRight: "1rem"}}>
					<div>{`${startSpeed ?? "? "}mph ${pitch.details?.type?.description ?? "?"} [${breaks.spinRate ?? '?'} SR]`}</div>
				</div>
			);
		}

		const authed = AuthDataStore.hasLevel(BackerType.ProBacker);
		const playVideoEnabled = moment().isAfter(moment(pitch.endTime).add(36, "hour"));
		const href = authed && playVideoEnabled ? `https://baseballsavant.mlb.com/sporty-videos?playId=${pitch.playId}` : "#";
		const linkClasses = classNames(styles.videoLink, {
			[styles.unauthed]: !authed
		});
		let label = "Video of pitch";
		if (!playVideoEnabled)
		{
			label += " (not available until 2 days after game)";
		}

		const tooltip = (
			<div style={{textAlign: "center", fontSize: "0.8rem"}}>
				<div>{label}</div>
			</div>
		);


		return (
			<GameDataStoreContext.Consumer>
				{gameDataStore => (<>
					<ListItem>
						<ListItemAvatar className={styles.pitchNumber}>
							<span style={{backgroundColor: pitch.details?.ballColor}}>{pitch.pitchNumber}</span>
						</ListItemAvatar>
						<ListItemText
							primary={pitch.details?.description}
							secondary={secondary}
						/>
						{pitch.playId &&
                        <ListItemSecondaryAction>
                            <Tooltip arrow title={tooltip} enterTouchDelay={0}>
                                <a
                                    target={"_blank"}
                                    className={linkClasses}
                                    href={href}
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
                                    }}
                                    style={{fontSize: "1.5rem"}}
                                >
                                    <MdVideoLibrary/>
                                </a>
                            </Tooltip>
                        </ListItemSecondaryAction>
						}
					</ListItem>
				</>)}
			</GameDataStoreContext.Consumer>
		);
	}
}