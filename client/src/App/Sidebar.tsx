import React, {ComponentType} from 'react';
import styles from "./App.module.scss";
import {Button, Collapse, DialogContentText, Grid} from "@material-ui/core";
import List from "@material-ui/core/List";
import SportsBaseball from '@material-ui/icons/SportsBaseball';
import {Equalizer, ExpandLess, ExpandMore, Menu, People, PlayCircleFilled} from "@material-ui/icons";
import EventIcon from "@material-ui/icons/Event";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {Link, Redirect, Route, Switch} from "react-router-dom";
import {SiteRoutes} from "../Global/Routes/Routes";
import {RecapTags} from "baseball-theater-engine";
import {StringUtils} from "../Utility/StringUtils";
import {AuthIntercom, IAuthContext} from "../Global/AuthIntercom";
import cookies from "browser-cookies";

interface ISidebarProps
{
	authContext: IAuthContext;
}

interface DefaultProps
{
	onNavigate?: () => void;
}

type Props = ISidebarProps & DefaultProps;
type State = ISidebarState;

interface ISidebarState
{
	videoTagsOpen: boolean;
}

export class Sidebar extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			videoTagsOpen: false,
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
		const redirectUri = `${window.location.protocol}//${window.location.hostname}:5000/auth/redirect`;
		return `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
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
		// const videoTags = Object.keys(RecapTags).filter(a => isNaN(parseInt(a))) as (keyof typeof RecapTags)[];
		// const videoTagsItems = videoTags.map(tag =>
		// {
		// 	const to = SiteRoutes.FeaturedVideos.resolve({tag});
		// 	const niceTag = StringUtils.splitCamelCaseToString(tag);
		//
		// 	return (
		// 		<ListItem onClick={onNavigate} button component={p => <Link {...p} to={to}/>}>
		// 			<ListItemText className={styles.indent} primary={niceTag}/>
		// 		</ListItem>
		// 	);
		// });

		return (
			<React.Fragment>
				<div className={styles.logo}>
					Baseball Theater
				</div>
				<List component={"nav"}>
					<MenuItem onClick={onNavigate} icon={<SportsBaseball/>} path={SiteRoutes.Games.resolve()}>
						Games
					</MenuItem>
					<MenuItem icon={<PlayCircleFilled/>} end={videoTagsOpen ? <ExpandLess/> : <ExpandMore/>} onClick={this.onFeaturedVideosClick}>
						Featured Videos
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
					<MenuItem onClick={onNavigate} icon={<EventIcon/>} path={SiteRoutes.Schedule.resolve()}>
						Schedule
					</MenuItem>
					<MenuItem onClick={onNavigate} icon={<People/>} path={SiteRoutes.Teams.resolve()}>
						Teams
					</MenuItem>
				</List>
				{!authContext.authorized &&
                <Button component={p => <a {...p} href={this.patreonUrl}/>}>
                    Log in with Patreon
                </Button>
				}
				{authContext.authorized &&
                <Button color={"primary"} onClick={this.logOut}>
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