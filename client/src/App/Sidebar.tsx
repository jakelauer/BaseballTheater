import { Teams } from "baseball-theater-engine";
import cookies from "browser-cookies";
import classNames from "classnames";
import moment from "moment";
import React from "react";
import { FaVideo } from "react-icons/all";
import { Link } from "react-router-dom";

import { Button, ListItemAvatar } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import { Equalizer, ReportProblem, Search } from "@material-ui/icons";
import EventIcon from "@material-ui/icons/Event";
import SettingsIcon from "@material-ui/icons/Settings";
import SportsBaseball from "@material-ui/icons/SportsBaseball";

import {
	AuthDataStore,
	BackerType,
	IAuthContext,
} from "../Global/AuthDataStore";
import { SiteRoutes } from "../Global/Routes/Routes";
import {
	ISettingsDataStorePayload,
	SettingsDataStore,
} from "../Global/Settings/SettingsDataStore";
import styles from "./App.module.scss";

interface ISidebarProps {
	authContext: IAuthContext;
}

interface DefaultProps {
	onNavigate?: () => void;
}

const PatreonButton = withStyles({
	root: {
		backgroundColor: "#f96854",
		"&:hover": {
			backgroundColor: "#ff8777",
		},
	},
})(Button);

const LogInButton = withStyles({
	root: {
		backgroundColor: "#DDDDDD",
		"&:hover": {
			backgroundColor: "#EEEEEE",
		},
	},
})(Button);

type Props = ISidebarProps & DefaultProps;
type State = ISidebarState;

interface ISidebarState {
	videoTagsOpen: boolean;
	settings: ISettingsDataStorePayload;
	authContext: IAuthContext;
}

class Sidebar extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			videoTagsOpen: false,
			settings: SettingsDataStore.state,
			authContext: AuthDataStore.state,
		};
	}

	public static defaultProps: DefaultProps = {
		onNavigate: () => {},
	};

	private onFeaturedVideosClick = () => {
		this.setState({
			videoTagsOpen: !this.state.videoTagsOpen,
		});
	};

	private get patreonUrl() {
		const clientId =
			"4f3fb1d9df8f53406f60617258e66ef5cba993b1aa72d2e32e66a1b5be0b9008";
		const host =
			window.location.hostname === "jlauer.local"
				? "jlauer.local:8000"
				: window.location.hostname;
		const protocol =
			window.location.hostname === "jlauer.local" ? "http:" : "https:";
		const redirectUri = `${protocol}//${host}/auth/redirect`;
		const scopes = ["users", "pledges-to-me", "my-campaign"];
		const state = encodeURIComponent(window.location.pathname);
		return `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
			redirectUri
		)}&scope=${scopes.join(" ")}&state=${state}`;
	}

	private logOut = () => {
		cookies.erase("auth");

		AuthDataStore.refresh();
	};

	public componentDidMount(): void {
		AuthDataStore.listen((data) =>
			this.setState({
				authContext: data,
			})
		);

		SettingsDataStore.listen((data) =>
			this.setState({
				settings: data,
			})
		);
	}

	public render() {
		const { videoTagsOpen } = this.state;
		const { authContext, onNavigate } = this.props;

		const isStarBacker = AuthDataStore.hasLevel(BackerType.StarBacker);

		return (
			<>
				<Link to="/" className={styles.logo}>
					Baseball Theater
				</Link>
				<List component={"nav"}>
					{isStarBacker &&
						this.state.settings.favoriteTeams.length > 0 && (
							<React.Fragment>
								{this.state.settings.favoriteTeams.map(
									(team) => (
										<MenuItem
											key={team}
											onClick={onNavigate}
											icon={<SportsBaseball />}
											path={SiteRoutes.Team.resolve({
												team,
											})}
										>
											{Teams.TeamList[team]}
										</MenuItem>
									)
								)}
								<Divider />
							</React.Fragment>
						)}
					<MenuItem
						onClick={onNavigate}
						icon={<EventIcon />}
						path={SiteRoutes.GamesRoot.resolve({})}
					>
						Games
					</MenuItem>
					{/*<MenuItem icon={<PlayCircleFilled/>} end={videoTagsOpen ? <ExpandLess/> : <ExpandMore/>} onClick={this.onFeaturedVideosClick}>
					 Highlights
					 </MenuItem>*/}
					<Collapse in={videoTagsOpen} timeout="auto">
						<List component="div" disablePadding>
							<ListItem
								onClick={onNavigate}
								button
								component={(p) => (
									<Link
										{...p}
										to={SiteRoutes.FeaturedVideos.resolve({
											category: "Recap",
										})}
									/>
								)}
							>
								<ListItemIcon className={styles.indent}>
									<FaVideo />
								</ListItemIcon>
								<ListItemText primary={"Recaps"} />
							</ListItem>
						</List>
					</Collapse>
					<MenuItem
						onClick={onNavigate}
						icon={<Equalizer />}
						path={SiteRoutes.Standings.resolve({
							year: moment().year().toString(),
						})}
					>
						Standings
					</MenuItem>
					<MenuItem
						onClick={onNavigate}
						icon={<Search />}
						path={SiteRoutes.Search.resolve({})}
					>
						Search
					</MenuItem>
					<MenuItem
						onClick={onNavigate}
						icon={<SettingsIcon />}
						path={SiteRoutes.Settings.resolve({})}
					>
						Settings
					</MenuItem>
				</List>
				{!authContext.authorized && authContext.loaded && (
					<React.Fragment>
						<a
							className={styles.patreonButtonLink}
							href={"https://www.patreon.com/jakelauer"}
						>
							<PatreonButton
								className={styles.patreonJoin}
								style={{ width: "100%" }}
							>
								Join as a Patron
							</PatreonButton>
						</a>
						<a
							className={styles.patreonButtonLink}
							href={this.patreonUrl}
						>
							<LogInButton
								className={styles.patreonButton}
								style={{ width: "100%" }}
							>
								Patron Log In
							</LogInButton>
						</a>
					</React.Fragment>
				)}
				{authContext.authorized && authContext.loaded && (
					<Button
						className={styles.patreonButton}
						onClick={this.logOut}
					>
						Log out
					</Button>
				)}
				<div className={styles.bottom}>
					<div className={styles.report}>
						<a
							target={"_blank"}
							rel={"noreferrer nofollow"}
							href={
								"https://github.com/jakelauer/BaseballTheater/issues/new"
							}
						>
							<ReportProblem /> <span>Report a Problem</span>
						</a>
					</div>
				</div>

				<Container style={{ textAlign: "center", padding: "2rem" }}>
					&copy; {moment().year()}. Created by{" "}
					<a href={"http://jakelauer.com"}>Jake Lauer</a> (
					<a href={"https://www.reddit.com/user/hellocontrol_"}>
						HelloControl_
					</a>
					). Go Cubs.
				</Container>
			</>
		);
	}
}

const MenuItem = (props: {
	icon: React.ReactElement;
	path?: string;
	children?: React.ReactNode;
	end?: React.ReactNode;
	textStyle?: React.CSSProperties;
	onClick?: () => void;
}) => {
	const component = props.path
		? (p: any) => <Link {...p} to={props.path} />
		: undefined;

	return (
		<ListItem
			button
			color={"primary"}
			component={component}
			onClick={props.onClick}
		>
			<ListItemAvatar>{props.icon}</ListItemAvatar>
			<ListItemText style={props.textStyle}>
				{props.children}
			</ListItemText>
			{props.end}
		</ListItem>
	);
};

interface ISponsorProps {
	imagePath?: string;
	url?: string;
}

const Sponsor: React.FC<ISponsorProps> = (props) => {
	const className = classNames(styles.sponsor, {
		[styles.hasLink]: !!props.url,
		[styles.hasImage]: !!props.imagePath,
	});

	let style: React.CSSProperties;
	if (props.imagePath) {
		style = {
			backgroundImage: `url(${props.imagePath})`,
		};
	}

	return (
		<a
			className={className}
			style={style}
			href={props.url}
			target={"_blank"}
			rel="noreferrer"
		>
			{!props.imagePath && <Typography>+ Diamond Sponsor</Typography>}
		</a>
	);
};

export default Sidebar;
