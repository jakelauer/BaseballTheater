import * as React from "react";
import {Container} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import ListItem from "@material-ui/core/ListItem";
import Select from "@material-ui/core/Select";
import {ITeams, Teams} from "baseball-theater-engine";
import MenuItem from "@material-ui/core/MenuItem";
import {ISettingsDataStorePayload, SettingsDataStore} from "../../Global/Settings/SettingsDataStore";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {GameTabs} from "../../Global/Routes/Routes";
import Divider from "@material-ui/core/Divider";

interface ISettingsAreaProps
{
}

interface DefaultProps
{
}

type Props = ISettingsAreaProps & DefaultProps;
type State = ISettingsAreaState;

interface ISettingsAreaState
{
	settings: ISettingsDataStorePayload;
}

export default class SettingsArea extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			settings: SettingsDataStore.state
		};
	}

	public componentDidMount(): void
	{
		SettingsDataStore.listen(data => this.setState({
			settings: data
		}));
	}

	private readonly handleTeamsChange = (event: React.ChangeEvent<{ value: unknown }>) =>
	{
		SettingsDataStore.setFavoriteTeams(event.target.value as (keyof ITeams)[]);
	};

	private readonly handleGameTabChange = (event: React.ChangeEvent<{ value: unknown }>) =>
	{
		SettingsDataStore.setDefaultGameTab(event.target.value as GameTabs);
	};

	private readonly handleHideScoresChange = (event: React.ChangeEvent<HTMLInputElement>) =>
	{
		SettingsDataStore.setHideScores(event.target.checked);
	};

	private readonly handleShowDescriptionsChange = (event: React.ChangeEvent<HTMLInputElement>) =>
	{
		SettingsDataStore.setShowDescriptions(event.target.checked);
	};

	public render()
	{
		const gameTabs: { [key in GameTabs]?: string } = {
			"Highlights": "Highlights",
			"BoxScore": "Box Score",
			"LiveGame": "Play-by-play"
		};

		return (
			<Container maxWidth={"sm"} style={{marginLeft: 0, paddingTop: "2rem"}}>
				<Typography variant={"h4"}>
					Settings
				</Typography>
				<Divider style={{margin: "1rem 0"}}/>
				<List>
					<Typography variant={"h6"} style={{marginTop: "2rem"}}>
						Game List
					</Typography>
					<ListItem style={{paddingLeft: 0, paddingRight: 0}}>
						<ListItemText primary={"Favorite Teams"}/>
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
									renderValue={value =>
									{
										const valueArray = value as string[];

										return valueArray.length > 3
											? `${valueArray.length} Teams`
											: valueArray.map(a => a.toUpperCase()).join(", ");
									}}
								>
									{Object.keys(Teams.TeamList).map(key => (
										<MenuItem value={key} style={{padding: 5}}>
											<Checkbox checked={this.state.settings.favoriteTeams.indexOf(key as keyof ITeams) > -1}/>
											{Teams.TeamList[key as keyof ITeams]}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</ListItemSecondaryAction>
					</ListItem>

					<ListItem style={{paddingLeft: 0, paddingRight: 0}}>
						<ListItemText primary={"Hide Scores"}/>
						<ListItemSecondaryAction>
							<Switch
								value={this.state.settings.hideScores}
								checked={this.state.settings.hideScores}
								onChange={this.handleHideScoresChange}
								edge="end"
							/>
						</ListItemSecondaryAction>
					</ListItem>

					<Typography variant={"h6"} style={{marginTop: "2rem"}}>
						Game Detail
					</Typography>
					<ListItem style={{paddingLeft: 0, paddingRight: 0}}>
						<ListItemText primary={"Default Game Tab"}/>
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
										<MenuItem value={tab} style={{padding: 5}}>
											{gameTabs[tab as GameTabs]}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</ListItemSecondaryAction>
					</ListItem>

					<ListItem style={{paddingLeft: 0, paddingRight: 0}}>
						<ListItemText primary={"Show Highlight Descriptions"}/>
						<ListItemSecondaryAction>
							<Switch
								value={this.state.settings.highlightDescriptions}
								checked={this.state.settings.highlightDescriptions}
								onChange={this.handleShowDescriptionsChange}
								edge="end"
							/>
						</ListItemSecondaryAction>
					</ListItem>
				</List>
			</Container>
		);
	}
}