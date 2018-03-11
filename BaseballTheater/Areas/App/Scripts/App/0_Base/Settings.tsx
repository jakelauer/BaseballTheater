namespace Theater
{
	interface ISettingsContainerProps
	{
		settings: ISettings
	}

	export interface ISettings
	{
		favoriteTeam: string;
		hideScores: boolean;
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

			return <select defaultValue={this.props.settings.favoriteTeam} onChange={e => this.setFavoriteTeam(e)}>{options}</select>
		}

		private setFavoriteTeam(event: React.ChangeEvent<HTMLSelectElement>)
		{
			this.updateSettings({
				favoriteTeam: event.currentTarget.value,
				hideScores: this.props.settings.hideScores
			})
		}

		private setHideScores(event: React.ChangeEvent<HTMLInputElement>)
		{
			this.updateSettings({
				favoriteTeam: this.props.settings.favoriteTeam,
				hideScores: event.currentTarget.checked
			})
		}

		private updateSettings(settings: ISettings)
		{
			Cookies.set("hidescores", settings.hideScores);
			Cookies.set("favoriteteam", settings.favoriteTeam);
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
						label={"Hide Scores"}
						description={"When checked, scores and game data will be hidden to prevent spoilers. Box scores will still show data."}>

						<input type={`checkbox`} checked={this.props.settings.hideScores}  onChange={e => this.setHideScores(e)}/>

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
}