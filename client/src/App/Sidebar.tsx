import React from 'react';
import styles from "./App.module.scss";
import List from "@material-ui/core/List";
import SportsBaseball from '@material-ui/icons/SportsBaseball';
import SettingsIcon from '@material-ui/icons/Settings';
import {Equalizer, ExpandLess, ExpandMore, PlayCircleFilled} from "@material-ui/icons";
import EventIcon from "@material-ui/icons/Event";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {Link} from "react-router-dom";
import {SiteRoutes} from "../Global/Routes/Routes";
import {Teams} from "baseball-theater-engine";
import {AuthIntercom, IAuthContext} from "../Global/AuthIntercom";
import cookies from "browser-cookies";
import withStyles from "@material-ui/core/styles/withStyles";
import {Button} from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import {ISettingsIntercomPayload, SettingsIntercom} from "../Global/Settings/SettingsIntercom";

interface ISidebarProps
{
	authContext: IAuthContext;
}

interface DefaultProps
{
	onNavigate?: () => void;
}

const PatreonButton = withStyles({
	root: {
		backgroundColor: "#f96854",
		"&:hover": {
			backgroundColor: "#ff8777"
		}
	},
})(Button);

type Props = ISidebarProps & DefaultProps;
type State = ISidebarState;

interface ISidebarState
{
	videoTagsOpen: boolean;
	settings: ISettingsIntercomPayload;
}

export class Sidebar extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			videoTagsOpen: false,
			settings: SettingsIntercom.state
		};
	}

	public static defaultProps: DefaultProps = {
		onNavigate: () =>
		{
		}
	};

	private onFeaturedVideosClick = () =>
	{
		this.setState({
			videoTagsOpen: !this.state.videoTagsOpen
		})
	};

	private get patreonUrl()
	{
		const clientId = "4f3fb1d9df8f53406f60617258e66ef5cba993b1aa72d2e32e66a1b5be0b9008";
		const host = location.hostname === "localhost" ? "localhost:5000" : location.hostname;
		const redirectUri = `${window.location.protocol}//${host}/auth/redirect`;
		const scopes = ["users", "pledges-to-me", "my-campaign"];
		return `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join(" ")}`;
	}

	private logOut = () =>
	{
		cookies.erase("id");
		cookies.erase("token");
		cookies.erase("token_expiry");

		AuthIntercom.refresh();
	};

	public render()
	{
		const {videoTagsOpen} = this.state;
		const {authContext, onNavigate} = this.props;

		return (
			<React.Fragment>
				<div className={styles.logo}>
					Baseball Theater
				</div>
				<List component={"nav"}>
					<MenuItem onClick={onNavigate} icon={<EventIcon/>} path={SiteRoutes.Games.resolve()}>
						Games
					</MenuItem>
					{this.state.settings.favoriteTeams.length === 0 &&
                    <MenuItem onClick={onNavigate} icon={<SportsBaseball/>} path={SiteRoutes.Teams.resolve()}>
                        Teams
                    </MenuItem>
					}
					{this.state.settings.favoriteTeams.map(team => (
						<MenuItem key={team} onClick={onNavigate} icon={<SportsBaseball/>} path={SiteRoutes.Team.resolve({team})}>
							{Teams.TeamList[team]}
						</MenuItem>
					))}
					<MenuItem icon={<PlayCircleFilled/>} end={videoTagsOpen ? <ExpandLess/> : <ExpandMore/>} onClick={this.onFeaturedVideosClick}>
						Highlights
					</MenuItem>
					<Collapse in={videoTagsOpen} timeout="auto">
						<List component="div" disablePadding>
							<ListItem onClick={onNavigate} button component={p => <Link {...p} to={SiteRoutes.FeaturedVideos.resolve({category: "Recap"})}/>}>
								<ListItemText className={styles.indent} primary={"Recaps"}/>
							</ListItem>
						</List>
					</Collapse>
					<MenuItem onClick={onNavigate} icon={<Equalizer/>} path={SiteRoutes.Standings.resolve()}>
						Standings
					</MenuItem>
					<MenuItem onClick={onNavigate} icon={<SettingsIcon/>} path={SiteRoutes.Settings.resolve()}>
						Settings
					</MenuItem>
				</List>
				{!authContext.authorized && authContext.loaded &&
                <a className={styles.patreonButtonLink} href={this.patreonUrl}>
                    <PatreonButton className={styles.patreonButton} style={{width: "100%"}}>
                        Log in with Patreon
                    </PatreonButton>
                </a>
				}
				{authContext.authorized && authContext.loaded &&
                <Button className={styles.patreonButton} onClick={this.logOut}>
                    Log out
                </Button>
				}
			</React.Fragment>
		);
	}
}

const MenuItem = (props: {
	icon: React.ReactElement;
	path?: string;
	children?: React.ReactNode,
	end?: React.ReactNode,
	onClick?: () => void
}) =>
{
	const component = props.path
		? (p: any) => <Link {...p} to={props.path}/>
		: undefined;

	return (
		<ListItem button color={"primary"} component={component} onClick={props.onClick}>
			<ListItemIcon>
				{props.icon}
			</ListItemIcon>
			<ListItemText>
				{props.children}
			</ListItemText>
			{props.end}
		</ListItem>
	);
};