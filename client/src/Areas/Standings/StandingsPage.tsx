import * as React from "react";
import {MlbClientDataFetcher} from "../../Global/Mlb/MlbClientDataFetcher";
import moment from "moment";
import {Standings} from "baseball-theater-engine/contract/standings";
import {Tab, Tabs} from "@material-ui/core";
import classNames from "classnames";
import {ContainerProgress} from "../../UI/ContainerProgress";
import {DivisionStandings} from "./DivisionStandings";
import {WildCardStandings} from "./WildCardStandings";
import styles from "./StandingsPage.module.scss";

interface IStandingsPageProps
{
}

interface DefaultProps
{
}

type Props = IStandingsPageProps & DefaultProps;
type State = IStandingsPageState;

interface IStandingsPageState
{
	standings: Standings;
	tabIndex: number;
}

export class StandingsPage extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			standings: null,
			tabIndex: 0
		};
	}

	public componentDidMount(): void
	{
		this.loadStandings();
	}

	private loadStandings()
	{
		MlbClientDataFetcher.getStandings(moment())
			.then(data => this.setState({
				standings: data
			}));
	}

	private onTabSelect = (tabIndex: number) =>
	{
		this.setState({
			tabIndex
		});
	};

	public render()
	{
		if (!this.state.standings)
		{
			return <ContainerProgress/>;
		}

		const {tabIndex, standings} = this.state;

		return (
			<div>
				<Tabs
					value={tabIndex}
					onChange={(e, i) => this.onTabSelect(i)}
					centered={true}
					indicatorColor={"primary"}
					textColor="primary"
				>
					<Tab label={"Division"} value={0}/>
					<Tab label={"Wild Card"} value={1}/>
				</Tabs>

				{/* Both stay rendered so the page keeps the wider tab's width and the tabs don't shift */}
				<div className={classNames({[styles.hidden]: tabIndex !== 0})}>
					<DivisionStandings standings={standings}/>
				</div>

				<div className={classNames({[styles.hidden]: tabIndex !== 1})}>
					<WildCardStandings standings={standings}/>
				</div>
			</div>
		);
	}
}