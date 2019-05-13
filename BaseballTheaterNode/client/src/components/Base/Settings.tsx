import {Select, Switch} from "antd";
import * as React from "react";
import {GameDetailTabs} from "../GameDetail/GameDetail";
import {ISettings} from "../../DataStore/SettingsDispatcher";
import {Teams} from "@MlbDataServer/Contracts";
import Config from "../Config/config";
import {App} from "./app";
import {AppWrapper} from "./AppWrapper";

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

		return (
			<Select style={{width: 200}}
					mode={`multiple`}
					defaultValue={this.props.settings.favoriteTeam || "-1"}
					onChange={(v: string[]) => SettingsContainer.setFavoriteTeam(v)}>
				{options}
			</Select>
		);
	}

	private tabNameFromTab(tab: GameDetailTabs)
	{
		let tabName: string = tab;
		switch (tab)
		{
			case GameDetailTabs.BoxScore:
				tabName = "Box Score";
				break;

			case GameDetailTabs.Live:
				tabName = "Pitch-by-pitch";
				break;
		}

		return tabName;
	}

	private renderDefaultTabDropdown()
	{
		let tabKeys = Object.keys(GameDetailTabs).filter(a => isNaN(Number(a)));

		if (!Config.liveDataEnabled)
		{
			tabKeys = tabKeys.filter(a => a !== GameDetailTabs[GameDetailTabs.Live]);
		}

		const options = tabKeys.map((tabKeyString, i) =>
		{
			const tabKey = tabKeyString as GameDetailTabs;
			const tabName = this.tabNameFromTab(tabKey);
			return <Select.Option value={tabKeyString} key={i}>{tabName}</Select.Option>
		});

		const defaultValue = this.props.settings.defaultTab || GameDetailTabs.Highlights;
		const defaultValueString = GameDetailTabs[defaultValue];

		return <Select style={{width: 200}} defaultValue={defaultValueString} onChange={(v: string) => SettingsContainer.setDefaultTab(v)}>
			{options}
		</Select>;
	}

	private static setFavoriteTeam(value: string[])
	{
		this.updateSettings({
			favoriteTeam: value
		})
	}

	private static setHideScores(checked: boolean)
	{
		this.updateSettings({
			hideScores: checked,
		})
	}

	private static setDefaultTab(value: string)
	{
		this.updateSettings({
			defaultTab: value,
		})
	}

	private static updateSettings(settings: Partial<ISettings>)
	{
		App.setSettingsCookie(settings);
	}

	public render()
	{
		return (
			<div className={`settings-container`}>

				{AppWrapper.renderLoginButton()}
				
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

					<Switch checked={this.props.settings.hideScores} onChange={v => SettingsContainer.setHideScores(v)}/>
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
