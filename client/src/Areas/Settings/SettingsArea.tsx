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
import SettingsIntercom, {ISettingsIntercomPayload} from "../../Global/Settings/SettingsIntercom";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

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
	settings: ISettingsIntercomPayload;
}

export default class SettingsArea extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			settings: SettingsIntercom.state
		};
	}

	public componentDidMount(): void
	{
		SettingsIntercom.listen(data => this.setState({
			settings: data
		}));
	}

	private readonly handleTeamsChange = (event: React.ChangeEvent<{ value: unknown }>) =>
	{
		SettingsIntercom.setFavoriteTeams(event.target.value as (keyof ITeams)[]);
	};

	private readonly handleHideScoresChange = (event: React.ChangeEvent<HTMLInputElement>) =>
	{
		SettingsIntercom.setHideScores(event.target.checked);
	};

	public render()
	{
		return (
			<Container maxWidth={"sm"} style={{marginLeft: 0}}>
				<Typography variant={"h4"}>
					Settings
				</Typography>
				<List>
					<ListItem>
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
					<ListItem>
						<ListItemText primary={"Favorite Teams"}/>
						<ListItemSecondaryAction>
							<FormControl>
								<InputLabel id="teamSelect">Team</InputLabel>
								<Select
									labelId={"teamSelect"}
									style={{
										width: 250
									}}
									value={this.state.settings.favoriteTeams}
									multiple
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
				</List>
			</Container>
		);
	}
}