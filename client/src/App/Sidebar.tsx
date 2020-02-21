import React from 'react';
import styles from "./App.module.scss";
import List from "@material-ui/core/List";
import SportsBaseball from '@material-ui/icons/SportsBaseball';
import SettingsIcon from '@material-ui/icons/Settings';
import {Equalizer, Search} from "@material-ui/icons";
import EventIcon from "@material-ui/icons/Event";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {SiteRoutes} from "../Global/Routes/Routes";
import {Teams} from "baseball-theater-engine";
import {AuthDataStore, BackerType, IAuthContext} from "../Global/AuthDataStore";
import cookies from "browser-cookies";
import withStyles from "@material-ui/core/styles/withStyles";
import {Button, ListItemAvatar} from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import {ISettingsDataStorePayload, SettingsDataStore} from "../Global/Settings/SettingsDataStore";
import classNames from "classnames";
import {FaVideo, FiDownloadCloud} from "react-icons/all";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import {ServiceWorkerUpdate} from "../Global/ServiceWorkerUpdate";
import Divider from "@material-ui/core/Divider";

interface ISidebarProps extends RouteComponentProps
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

const LogInButton = withStyles({
	root: {
		backgroundColor: "#DDDDDD",
		"&:hover": {
			backgroundColor: "#EEEEEE"
		}
	}
})(Button);

type Props = ISidebarProps & DefaultProps;
type State = ISidebarState;

interface ISidebarState
{
	videoTagsOpen: boolean;
	settings: ISettingsDataStorePayload;
	authContext: IAuthContext;
	waitingForUpdate: boolean;
}

class Sidebar extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			videoTagsOpen: false,
			settings: SettingsDataStore.state,
			authContext: AuthDataStore.state,
			waitingForUpdate: false
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
		const state = encodeURIComponent(this.props.location.pathname);
		return `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join(" ")}&state=${state}`;
	}

	private logOut = () =>
	{
		cookies.erase("id");
		cookies.erase("token");
		cookies.erase("token_expiry");

		AuthDataStore.refresh();
	};

	public componentDidMount(): void
	{
		AuthDataStore.listen(data => this.setState({
			authContext: data
		}));

		SettingsDataStore.listen(data => this.setState({
			settings: data
		}));

		this.checkUpdates();
	}

	private checkUpdates()
	{
		ServiceWorkerUpdate.checkForUpdates((hasUpdate) =>
		{
			this.setState({
				waitingForUpdate: hasUpdate
			})
		});
	}

	public render()
	{
		const {videoTagsOpen} = this.state;
		const {authContext, onNavigate} = this.props;

		const isStarBacker = AuthDataStore.hasLevel(BackerType.StarBacker);

		return (
			<>
				<Link to="/" className={styles.logo}>
					Baseball Theater
				</Link>
				<List component={"nav"}>
					{this.state.waitingForUpdate && (
						<React.Fragment>
							<Tooltip title={"Click to update"}>
								<MenuItem onClick={ServiceWorkerUpdate.update} icon={<FiDownloadCloud/>} textStyle={{color: "#ce0f0f"}}>
									New Version Available
								</MenuItem>
							</Tooltip>
							<Divider/>
						</React.Fragment>
					)}
					{isStarBacker && this.state.settings.favoriteTeams.length > 0 && (
						<React.Fragment>
							{this.state.settings.favoriteTeams.map(team => (
								<MenuItem key={team} onClick={onNavigate} icon={<SportsBaseball/>} path={SiteRoutes.Team.resolve({team})}>
									{Teams.TeamList[team]}
								</MenuItem>
							))}
							<Divider/>
						</React.Fragment>
					)}
					<MenuItem onClick={onNavigate} icon={<EventIcon/>} path={SiteRoutes.Games.resolve()}>
						Games
					</MenuItem>
					{/*<MenuItem icon={<PlayCircleFilled/>} end={videoTagsOpen ? <ExpandLess/> : <ExpandMore/>} onClick={this.onFeaturedVideosClick}>
					 Highlights
					 </MenuItem>*/}
					<Collapse in={videoTagsOpen} timeout="auto">
						<List component="div" disablePadding>
							<ListItem onClick={onNavigate} button component={p => <Link {...p} to={SiteRoutes.FeaturedVideos.resolve({category: "Recap"})}/>}>
								<ListItemIcon className={styles.indent}><FaVideo/></ListItemIcon>
								<ListItemText primary={"Recaps"}/>
							</ListItem>
						</List>
					</Collapse>
					<MenuItem onClick={onNavigate} icon={<Equalizer/>} path={SiteRoutes.Standings.resolve()}>
						Standings
					</MenuItem>
					<MenuItem onClick={onNavigate} icon={<Search/>} path={SiteRoutes.Search.resolve()}>
						Search
					</MenuItem>
					<MenuItem onClick={onNavigate} icon={<SettingsIcon/>} path={SiteRoutes.Settings.resolve()}>
						Settings
					</MenuItem>
				</List>
				{!authContext.authorized && authContext.loaded && (
					<React.Fragment>
						<a className={styles.patreonButtonLink} href={"https://www.patreon.com/jakelauer"}>
							<PatreonButton className={styles.patreonJoin} style={{width: "100%"}}>
								Join as a Patron
							</PatreonButton>
						</a>
						<a className={styles.patreonButtonLink} href={this.patreonUrl}>
							<LogInButton className={styles.patreonButton} style={{width: "100%"}}>
								Patron Log In
							</LogInButton>
						</a>
					</React.Fragment>
				)
				}
				{authContext.authorized && authContext.loaded &&
                <Button className={styles.patreonButton} onClick={this.logOut}>
                    Log out
                </Button>
				}
				<div className={styles.sponsors}>
					<p>Diamond Sponsors</p>
					<Sponsor imagePath={"/assets/backers/playback.svg"} url={"https://getplayback.com"}/>
					<Sponsor imagePath={"/assets/backers/storeporter.png"} url={"https://storeporter.com"}/>
					<Sponsor/>
				</div>
			</>
		);
	}
}

const MenuItem = (props: {
	icon: React.ReactElement;
	path?: string;
	children?: React.ReactNode,
	end?: React.ReactNode,
	textStyle?: React.CSSProperties,
	onClick?: () => void
}) =>
{
	const component = props.path
		? (p: any) => <Link {...p} to={props.path}/>
		: undefined;

	return (
		<ListItem button color={"primary"} component={component} onClick={props.onClick}>
			<ListItemAvatar>
				{props.icon}
			</ListItemAvatar>
			<ListItemText style={props.textStyle}>
				{props.children}
			</ListItemText>
			{props.end}
		</ListItem>
	);
};

interface ISponsorProps
{
	imagePath?: string;
	url?: string;
}

const Sponsor: React.FC<ISponsorProps> = (props) =>
{
	const className = classNames(styles.sponsor, {
		[styles.hasSponsor]: !!props.imagePath
	});

	let style: React.CSSProperties;
	if (props.imagePath)
	{
		style = {
			backgroundImage: `url(${props.imagePath})`
		};
	}

	return (
		<a className={className} style={style} href={props.url} target={"_blank"}>
			{!props.imagePath && <Typography>+ Diamond Sponsor</Typography>}
		</a>
	);
};


export default withRouter(Sidebar);