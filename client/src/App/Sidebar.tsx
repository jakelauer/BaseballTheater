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
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {SiteRoutes} from "../Global/Routes/Routes";
import {Teams} from "baseball-theater-engine";
import {AuthIntercom, BackerType, IAuthContext} from "../Global/AuthIntercom";
import cookies from "browser-cookies";
import withStyles from "@material-ui/core/styles/withStyles";
import {Button, ListItemAvatar} from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import {ISettingsIntercomPayload, SettingsIntercom} from "../Global/Settings/SettingsIntercom";
import classNames from "classnames";
import {FaVideo, FiDownloadCloud, FiSearch} from "react-icons/all";
import Typography from "@material-ui/core/Typography";

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

type Props = ISidebarProps & DefaultProps;
type State = ISidebarState;

interface ISidebarState
{
	videoTagsOpen: boolean;
	settings: ISettingsIntercomPayload;
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
			settings: SettingsIntercom.state,
			authContext: AuthIntercom.state,
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

		AuthIntercom.refresh();
	};

	public componentDidMount(): void
	{
		AuthIntercom.listen(data => this.setState({
			authContext: data
		}));

		this.checkUpdates();
	}

	private async checkUpdates()
	{

		if ('serviceWorker' in navigator)
		{
			const testForUpdate = (registration: ServiceWorkerRegistration) =>
			{
				if (registration?.waiting && registration?.active)
				{
					this.setState({
						waitingForUpdate: true
					});
				}
			};

			navigator.serviceWorker.getRegistration().then(testForUpdate);

			window.addEventListener('load', async () =>
			{
				const registration = await navigator.serviceWorker.register('/service-worker.js');
				testForUpdate(registration);
			});
		}
	}

	public render()
	{
		const {videoTagsOpen} = this.state;
		const {authContext, onNavigate} = this.props;

		const isStarBacker = AuthIntercom.hasLevel(BackerType.StarBacker);

		return (
			<React.Fragment>
				<Link to="/" className={styles.logo}>
					Baseball Theater
				</Link>
				<List component={"nav"}>
					{this.state.waitingForUpdate && (
						<MenuItem onClick={update} icon={<FiDownloadCloud/>} textStyle={{color: "#ce0f0f"}}>
							New Version Available
						</MenuItem>
					)}
					<MenuItem onClick={onNavigate} icon={<EventIcon/>} path={SiteRoutes.Games.resolve()}>
						Games
					</MenuItem>
					{isStarBacker && this.state.settings.favoriteTeams.map(team => (
						<MenuItem key={team} onClick={onNavigate} icon={<SportsBaseball/>} path={SiteRoutes.Team.resolve({team})}>
							{Teams.TeamList[team]}
						</MenuItem>
					))}
					<MenuItem icon={<PlayCircleFilled/>} end={videoTagsOpen ? <ExpandLess/> : <ExpandMore/>} onClick={this.onFeaturedVideosClick}>
						Highlights
					</MenuItem>
					<Collapse in={videoTagsOpen} timeout="auto">
						<List component="div" disablePadding>
							<ListItem onClick={onNavigate} button component={p => <Link {...p} to={SiteRoutes.Search.resolve()}/>}>
								<ListItemIcon className={styles.indent}><FiSearch/></ListItemIcon>
								<ListItemText primary={"Search"}/>
							</ListItem>
							<ListItem onClick={onNavigate} button component={p => <Link {...p} to={SiteRoutes.FeaturedVideos.resolve({category: "Recap"})}/>}>
								<ListItemIcon className={styles.indent}><FaVideo/></ListItemIcon>
								<ListItemText primary={"Recaps"}/>
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
				{!authContext.authorized && authContext.loaded && (
					<React.Fragment>
						<a className={styles.patreonButtonLink} href={"https://www.patreon.com/jakelauer"}>
							<PatreonButton className={styles.patreonJoin} style={{width: "100%"}}>
								Become a Patron
							</PatreonButton>
						</a>
						<a className={styles.patreonButtonLink} href={this.patreonUrl}>
							<PatreonButton className={styles.patreonButton} style={{width: "100%"}}>
								Log in with Patreon
							</PatreonButton>
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
					<Sponsor/>
					<Sponsor/>
				</div>
			</React.Fragment>
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

export async function update()
{
	try
	{
		const registration = await navigator.serviceWorker.getRegistration();

		if (!registration)
		{
			location.reload();
			return;
		}

		if (!registration.waiting)
		{
			const isInstalling = registration.installing!;
			if (isInstalling)
			{
				isInstalling.onstatechange = () =>
					isInstalling.state === "installed" && isInstalling.postMessage('skipWaiting');
			}
			else
			{
				location.reload();
			}
			return;
		}

		registration.waiting.postMessage('skipWaiting');
	}
	catch (e)
	{
		console.error('SW: Error checking registration:', e);
		window.location.reload();
	}
}

export default withRouter(Sidebar);