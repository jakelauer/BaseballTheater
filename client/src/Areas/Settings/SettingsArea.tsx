import { Container } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { ITeams, TeamList, Teams } from 'baseball-theater-engine';
import * as React from 'react';

import { AuthDataStore, BackerType, IAuthContext } from '../../Global/AuthDataStore';
import { GameTabs } from '../../Global/Routes/Routes';
import { ISettingsDataStorePayload, SettingsDataStore } from '../../Global/Settings/SettingsDataStore';
import { Upsell } from '../../UI/Upsell';

interface ISettingsAreaProps {
}

interface DefaultProps {
}

type Props = ISettingsAreaProps & DefaultProps;
type State = ISettingsAreaState;

interface ISettingsAreaState {
	settings: ISettingsDataStorePayload;
	authContext: IAuthContext;
}

export default class SettingsArea extends React.Component<Props, State>
{
	constructor(props: Props) {
		super(props);

		this.state = {
			authContext: AuthDataStore.state,
			settings: SettingsDataStore.state
		};
	}

	public componentDidMount(): void {
		SettingsDataStore.listen(data => this.setState({
			settings: data
		}));

		AuthDataStore.listen(authContext => this.setState({ authContext }));
	}

	private readonly handleTeamsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		SettingsDataStore.setFavoriteTeams(event.target.value as (keyof ITeams)[]);
	};

	private readonly handleGameTabChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		SettingsDataStore.setDefaultGameTab(event.target.value as GameTabs);
	};

	private readonly handleHideScoresChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		SettingsDataStore.setHideScores(event.target.checked);
	};

	private readonly handleShowDescriptionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		SettingsDataStore.setShowDescriptions(event.target.checked);
	};

	private readonly handleShowUpdateBarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		SettingsDataStore.setShowUpdateBar(event.target.checked);
	};

	private readonly handleAutoplayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		SettingsDataStore.setAutoplay(event.target.checked);
	}

	private readonly handleDialogs = (event: React.ChangeEvent<HTMLInputElement>) => {
		SettingsDataStore.setDialogs(event.target.checked);
		if(!event.target.checked)
		{
			SettingsDataStore.setAutoplay(false);
		}
	}

	public render() {
		const gameTabs: { [key in GameTabs]?: string } = {
			"Highlights": "Highlights",
			"BoxScore": "Box Score",
			"LiveGame": "Play-by-play"
		};

		const ogTeamList = Teams.TeamList;
		const teamNames = Object.values(ogTeamList);
		const uniqueTeamNames = Array.from(new Set(teamNames));

		// This is convoluted... but it basically makes a unique list of team names, then gets the team file codes from those.
		const reversedTeamList = Object.keys(TeamList).reduce((obj, key) => {
			const val = TeamList[key as keyof typeof TeamList] as string;
			return { ...obj, ...{ [val as string]: key } };
		}, {}) as { [key: string]: string };

		const teamList = uniqueTeamNames.map(v => reversedTeamList[v]) as (keyof ITeams)[];


		return (
			<Container maxWidth={"sm"} style={{ marginLeft: 0, paddingTop: "2rem" }}>
				<Typography variant={"h4"}>
					Settings
				</Typography>
				<Divider style={{ margin: "1rem 0" }} />
				<List>
					<Typography variant={"h6"} style={{ marginTop: "2rem" }}>
						Game List
					</Typography>
					<ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
						<ListItemText primary={"Favorite Teams"} />
						<ListItemSecondaryAction>
							<FormControl variant={"standard"} style={{
								width: 150
							}}>
								<InputLabel id="teamSelect">Team</InputLabel>
								<Select
									labelId={"teamSelect"}
									value={this.state.settings.favoriteTeams}
									multiple
									style={{
										width: "100%"
									}}
									onChange={this.handleTeamsChange}
									renderValue={value => {
										const valueArray = value as string[];

										return valueArray.length > 3
											? `${valueArray.length} Teams`
											: valueArray.map(a => a.toUpperCase()).join(", ");
									}}
								>
									{teamList.map(key => (
										<MenuItem value={key} style={{ padding: 5 }}>
											<Checkbox checked={this.state.settings.favoriteTeams.indexOf(key as keyof ITeams) > -1} />
											{Teams.TeamList[key as keyof ITeams]}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</ListItemSecondaryAction>
					</ListItem>

					<ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
						<ListItemText primary={"Hide Scores"} />
						<ListItemSecondaryAction>
							<Switch
								value={this.state.settings.hideScores}
								checked={this.state.settings.hideScores}
								onChange={this.handleHideScoresChange}
								edge="end"
							/>
						</ListItemSecondaryAction>
					</ListItem>

					<Typography variant={"h6"} style={{ marginTop: "2rem" }}>
						Game Detail
					</Typography>
					<ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
						<ListItemText primary={"Default Game Tab"} />
						<ListItemSecondaryAction>
							<FormControl variant={"standard"} style={{
								width: 150
							}}>
								<Select
									labelId={"teamSelect"}
									value={this.state.settings.defaultGameTab}
									style={{
										width: "100%"
									}}
									onChange={this.handleGameTabChange}
								>
									{Object.keys(gameTabs).map(tab => (
										<MenuItem value={tab} style={{ padding: 5 }}>
											{gameTabs[tab as GameTabs]}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</ListItemSecondaryAction>
					</ListItem>

					<ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
						<ListItemText primary={"Show Highlight Descriptions"} />
						<ListItemSecondaryAction>
							<Switch
								value={this.state.settings.highlightDescriptions}
								checked={this.state.settings.highlightDescriptions}
								onChange={this.handleShowDescriptionsChange}
								edge="end"
							/>
						</ListItemSecondaryAction>
					</ListItem>

					<ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
						<ListItemText primary={"Show Update Timer Bar"} />
						<ListItemSecondaryAction>
							<Switch
								value={this.state.settings.showUpdateBar}
								checked={this.state.settings.showUpdateBar}
								onChange={this.handleShowUpdateBarChange}
								edge="end"
							/>
						</ListItemSecondaryAction>
					</ListItem>

					<ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
						<ListItemText primary={"Autoplay Videos"} />
						<ListItemSecondaryAction>
							<Switch
								value={this.state.settings.autoplay}
								checked={this.state.settings.autoplay}
								onChange={this.handleAutoplayChange}
								edge="end"
								disabled={!this.state.settings.dialogs}
							/>
						</ListItemSecondaryAction>
					</ListItem>

					<ListItem style={{ paddingLeft: 0, paddingRight: 0 }}>
						<ListItemText primary={"Show Videos in Dialogs"} />
						<ListItemSecondaryAction>
							<Switch
								value={this.state.settings.dialogs}
								checked={this.state.settings.dialogs}
								onChange={this.handleDialogs}
								edge="end"
							/>
						</ListItemSecondaryAction>
					</ListItem>
				</List>


				{!AuthDataStore.hasLevel(BackerType.Backer) && (
					<div>
						<Divider />
						<Upsell hideClose={true} levelRequired={BackerType.Backer} isModal={true} titleOverride={"Did you know? Backers can sync settings!"} />
					</div>
				)}
			</Container>
		);
	}
}