import {Select, Switch} from "antd";
import * as Cookies from "js-cookie";
import * as React from "react";
import {ISettings} from "../../DataStore/SettingsDispatcher";
import {Teams} from "../../MlbDataServer/Contracts";
import {GameDetailTabs} from "../GameDetail/game_detail";
import {App} from "./app";

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
			return <Select.Option value={teamKey} key={i}>{teamName}</Select.Option>;
		});

		options.splice(0, 0, <Select.Option value={"-1"} key={999}>None</Select.Option>);

		return <Select style={{width: 200}} defaultValue={this.props.settings.favoriteTeam || "-1"} onChange={(v: string) => this.setFavoriteTeam(v)}>{options}</Select>
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
		const allKeys = Object.keys(GameDetailTabs);
		const tabKeys = allKeys.slice(0, allKeys.length / 2);
		const options = tabKeys.map((tabKeyString, i) =>
		{
			const tabKey = parseInt(tabKeyString) as GameDetailTabs;
			const tabName = this.tabNameFromTab(tabKey);
			return <Select.Option value={tabKeyString} key={i}>{tabName}</Select.Option>
		});

		return <Select style={{width: 200}} defaultValue={this.props.settings.defaultTab || "0"} onChange={(v: string) => this.setDefaultTab(v)}>
			{options}
		</Select>;
	}

	private setFavoriteTeam(value: string)
	{
		this.updateSettings({
			favoriteTeam: value,
			hideScores: this.props.settings.hideScores,
			defaultTab: this.props.settings.defaultTab
		})
	}

	private setHideScores(checked: boolean)
	{
		this.updateSettings({
			favoriteTeam: this.props.settings.favoriteTeam,
			hideScores: checked,
			defaultTab: this.props.settings.defaultTab
		})
	}

	private setDefaultTab(value: string)
	{
		this.updateSettings({
			favoriteTeam: this.props.settings.favoriteTeam,
			defaultTab: value,
			hideScores: this.props.settings.hideScores
		})
	}

	private updateSettings(settings: ISettings)
	{
		Cookies.set("hidescores", String(settings.hideScores));
		Cookies.set("favoriteteam", settings.favoriteTeam);
		Cookies.set("defaulttab", settings.defaultTab);
		App.Instance.settingsDispatcher.update({
			hideScores: settings.hideScores,
			favoriteTeam: settings.favoriteTeam,
			defaultTab: settings.defaultTab
		})
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

					<Switch checked={this.props.settings.hideScores} onChange={v => this.setHideScores(v)}/>
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
