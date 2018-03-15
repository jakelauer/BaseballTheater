import * as Cookies from "js-cookie";
import * as React from "react";
import {Teams} from "../../MlbDataServer/Contracts";
import {GameDetailTabs} from "../GameDetail/game_detail";
import {App} from "./app";
import {ISettings} from "./page";

interface ISettingsContainerProps
{
	settings: ISettings
}

export class SettingsContainer extends React.Component<ISettingsContainerProps, any>
{
	constructor(props: ISettingsContainerProps)
	{
		super(props);
	}

	private renderTeamDropdown()
	{
		const teamKeys = Object.keys(Teams.TeamList);
		const options = teamKeys.map((teamKey, i) =>
		{
			const teamName = Teams.TeamList[teamKey];
			return <option value={teamKey} key={i}>{teamName}</option>;
		});

		options.splice(0, 0, <option value={-1} key={999}>None</option>);

		return <select defaultValue={this.props.settings.favoriteTeam} onChange={e => this.setFavoriteTeam(e)}>{options}</select>
	}

	private tabNameFromTab(tab: GameDetailTabs)
	{
		let tabName = "";
		switch (tab)
		{
			case GameDetailTabs.BoxScore:
				tabName = "Box Score";
				break;

			case GameDetailTabs.Highlights:
				tabName = "Highlights";
				break;

			case GameDetailTabs.PlayByPlay:
				tabName = "Play By Play";
				break;
		}

		return tabName;
	}

	private renderDefaultTabDropdown()
	{
		const tabKeys = Object.keys(GameDetailTabs);
		const options = tabKeys.map((tabKeyString, i) =>
		{
			const tabKey = parseInt(tabKeyString) as GameDetailTabs;
			const tabName = this.tabNameFromTab(tabKey);
			return <option value={tabKeyString} key={i}>{tabName}</option>
		});

		return <select defaultValue={this.props.settings.defaultTab} onChange={e => this.setDefaultTab(e)}>{options}</select>
	}

	private setFavoriteTeam(event: React.ChangeEvent<HTMLSelectElement>)
	{
		this.updateSettings({
			favoriteTeam: event.currentTarget.value,
			hideScores: this.props.settings.hideScores,
			defaultTab: this.props.settings.defaultTab
		})
	}

	private setHideScores(event: React.ChangeEvent<HTMLInputElement>)
	{
		this.updateSettings({
			favoriteTeam: this.props.settings.favoriteTeam,
			hideScores: event.currentTarget.checked,
			defaultTab: this.props.settings.defaultTab
		})
	}

	private setDefaultTab(event: React.ChangeEvent<HTMLSelectElement>)
	{
		this.updateSettings({
			favoriteTeam: this.props.settings.favoriteTeam,
			defaultTab: event.currentTarget.value,
			hideScores: this.props.settings.hideScores
		})
	}

	private updateSettings(settings: ISettings)
	{
		Cookies.set("hidescores", String(settings.hideScores));
		Cookies.set("favoriteteam", settings.favoriteTeam);
		Cookies.set("defaulttab", settings.defaultTab);
		App.Instance.settingsDistributor.distribute(settings)
	}

	public render()
	{
		return (
			<div className={`settings-container`}>
				<SettingDisplay
					label={"Favorite Team"}
					description={"Set your favorite team to sort their games to the top in the games list"}>
					{this.renderTeamDropdown()}
				</SettingDisplay>

				<SettingDisplay
					label={`Default Tab`}
					description={`Set the default tab for game details`}>
					{this.renderDefaultTabDropdown()}
				</SettingDisplay>

				<SettingDisplay
					label={"Hide Scores"}
					description={"When checked, scores and game data will be hidden to prevent spoilers. Box scores will still show data."}>

					<input type={`checkbox`} checked={this.props.settings.hideScores} onChange={e => this.setHideScores(e)}/>
				</SettingDisplay>

			</div>
		);
	}
}

interface ISettingProps
{
	label: string;
	description: string;
}

class SettingDisplay extends React.Component<ISettingProps, any>
{
	public render()
	{
		return (
			<div className={`setting`}>
				<div className={`setting-trigger`}>
					{this.props.children}
				</div>
				<div className={`setting-info`}>
					<div className={`label`}>{this.props.label}</div>
					<div className={`description`}>{this.props.description}</div>
				</div>
			</div>
		);
	}
}
