import * as React from "react";

interface ISettingsProps
{
	onSettingsClicked: () => void;
}

export class SettingsButton extends React.Component<ISettingsProps, any>
{
	public render()
	{
		return (
			<div className={`settings-trigger`}>
				<i onClick={() => this.props.onSettingsClicked()} className="material-icons">settings</i>
			</div>
		);
	}
}
