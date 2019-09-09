import React from 'react';
import styles from "./App.module.scss";
import {CircularProgress, DialogContent, Grid} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SportsBaseball from '@material-ui/icons/SportsBaseball';
import ListItemText from "@material-ui/core/ListItemText";
import {Equalizer, People, PlayCircleFilled} from "@material-ui/icons";
import EventIcon from "@material-ui/icons/Event";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Drawer from "@material-ui/core/Drawer";
import {Link} from "react-router-dom";

interface IAppState
{
	drawerOpen: boolean;
	search: string;
	loading: boolean;
	error: string;
}


export class App extends React.Component<{}, IAppState>
{
	private apiTimeout: number = null;

	constructor(props: {})
	{
		super(props);

		this.state = {
			drawerOpen: true,
			error: "",
			search: "",
			loading: false
		};
	}

	componentDidMount()
	{

	}

	private closeDrawer = () =>
	{
		this.setState({
			drawerOpen: false
		});
	};

	private openDrawer = () =>
	{
		this.setState({
			drawerOpen: true
		});
	};

	public render()
	{
		const loading = this.state.loading ?
			<CircularProgress/>
			: null;

		const isMobile = false;

		return (
			<div className={styles.wrapper}>
				<Drawer anchor={"left"} variant={"permanent"} open={this.state.drawerOpen}>
					<div className={styles.logo}>
						Baseball Theater
					</div>
					<List component={"nav"}>
						<ListItem button color={"primary"}>
							<ListItemIcon>
								<SportsBaseball/>
							</ListItemIcon>
							<ListItemText>
								Games
							</ListItemText>
						</ListItem>
						<ListItem button color={"primary"}>
							<ListItemIcon>
								<PlayCircleFilled/>
							</ListItemIcon>
							<ListItemText>
								Featured Videos
							</ListItemText>
						</ListItem>
						<ListItem button color={"primary"}>
							<ListItemIcon>
								<Equalizer/>
							</ListItemIcon>
							<ListItemText>
								Standings
							</ListItemText>
						</ListItem>
						<ListItem button color={"primary"}>
							<ListItemIcon>
								<EventIcon/>
							</ListItemIcon>
							<ListItemText>
								Schedule
							</ListItemText>
						</ListItem>
						<ListItem button color={"primary"}>
							<ListItemIcon>
								<People/>
							</ListItemIcon>
							<ListItemText>
								Teams
							</ListItemText>
						</ListItem>
					</List>
				</Drawer>
				<Container>
					<Grid container>
						{loading}
					</Grid>
					<Grid container>
					</Grid>
				</Container>
				<Dialog open={this.state.error !== ""} onClose={() => this.setState({error: ""})}>
					<DialogTitle>Error</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{this.state.error}
						</DialogContentText>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
}

export default App;
