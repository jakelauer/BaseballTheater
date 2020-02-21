import * as React from "react";
import {Tab, Tabs} from "@material-ui/core";
import styles from "./TeamsArea.module.scss";
import TeamHighlights from "./TeamHighlights";
import TeamSchedule from "./TeamSchedule";
import {AuthDataStore, BackerType, IAuthContext} from "../../Global/AuthDataStore";
import {Upsell} from "../../UI/Upsell";

interface ITeamsAreaProps
{
}

interface DefaultProps
{
}

type Props = ITeamsAreaProps & DefaultProps;
type State = ITeamsAreaState;

interface ITeamsAreaState
{
	index: number;
	authContext: IAuthContext;
}

export default class TeamsArea extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			index: 0,
			authContext: AuthDataStore.state
		};
	}

	public componentDidMount(): void
	{
		AuthDataStore.listen(data =>
		{
			this.setState({
				authContext: data
			});
		});
	}

	private onTabSelect = (index: number) =>
	{
		this.setState({
			index
		});
	};

	public render()
	{
		const index = this.state.index;

		const hasPerms = AuthDataStore.hasLevel(BackerType.StarBacker);
		if (!hasPerms)
		{
			return <Upsell isModal={false} levelRequired={BackerType.StarBacker}/>;
		}

		return (
			<React.Fragment>
				<Tabs
					className={styles.tabs}
					orientation={"horizontal"}
					value={this.state.index}
					onChange={(e, i) => this.onTabSelect(i)}
					centered={true}
					indicatorColor={"primary"}
					textColor="primary"
				>
					<Tab label={"Schedule"} value={0}/>
					<Tab label={"Recent Highlights"} value={1}/>
				</Tabs>

				{index === 0 && (
					<TeamSchedule/>
				)}

				{index === 1 && (
					<TeamHighlights/>
				)}
			</React.Fragment>
		);
	}
}