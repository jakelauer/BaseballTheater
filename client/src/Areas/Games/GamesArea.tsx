import * as React from "react";
import moment from "moment/moment";
import {RouteComponentProps, withRouter} from "react-router";
import {GameList} from "./GameList";
import styles from "./GamesArea.module.scss";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/moment';
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import Fab from "@material-ui/core/Fab";
import {SiteRoutes} from "../../Global/Routes/Routes";
import {GamesUtils} from "../../Utility/GamesUtils";
import {Button} from "@material-ui/core";

interface IGamesAreaParams
{
	yyyymmdd: string;
}

interface IGamesAreaState
{
	dateString: string;
}

class GamesArea extends React.Component<RouteComponentProps<IGamesAreaParams>, IGamesAreaState>
{
	private static SessionStorageDateStringKey = "game-list-date";

	constructor(props: RouteComponentProps<IGamesAreaParams>)
	{
		super(props);

		this.state = {
			dateString: props.match.params.yyyymmdd || GamesUtils.StartingDate().format("YYYYMMDD")
		};
	}

	public componentDidMount(): void
	{
		if (!this.props.match.params.yyyymmdd)
		{
			this.props.history.replace(SiteRoutes.Games.resolve({
				yyyymmdd: this.state.dateString
			}))
		}
	}

	public static getDerivedStateFromProps(p: RouteComponentProps<IGamesAreaParams>)
	{
		const storedDateString = sessionStorage.getItem(GamesArea.SessionStorageDateStringKey);

		const dateString = p.match.params.yyyymmdd || storedDateString || GamesUtils.StartingDate().format("YYYYMMDD");

		sessionStorage.setItem(GamesArea.SessionStorageDateStringKey, dateString);

		return {
			dateString
		};
	}

	private onDateChange = (date: moment.Moment, value?: string) =>
	{
		if (date.isValid())
		{
			const newDate = date.format("YYYYMMDD");

			this.props.history.push(SiteRoutes.Games.resolve({
				yyyymmdd: newDate
			}));
		}
	};

	private nextDate = () =>
	{
		const nextDate = moment(this.state.dateString).add(1, "day");

		this.props.history.push(SiteRoutes.Games.resolve({
			yyyymmdd: nextDate.format("YYYYMMDD")
		}));
	};

	private prevDate = () =>
	{
		const prevDate = moment(this.state.dateString).add(-1, "day");

		this.props.history.push(SiteRoutes.Games.resolve({
			yyyymmdd: prevDate.format("YYYYMMDD")
		}));
	};

	private today = () =>
	{
		this.props.history.push(SiteRoutes.Games.resolve({
			yyyymmdd: moment().format("YYYYMMDD")
		}));
	};

	public render()
	{
		const date = moment(this.state.dateString);

		return (
			<div className={styles.wrapper}>
				<div className={styles.date}>
					<div>
						<Fab size={"small"} color={"primary"} onClick={this.prevDate}>
							<KeyboardArrowLeft/>
						</Fab>
					</div>
					<div className={styles.datePicker}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
								disableToolbar
								variant="inline"
								format="MM/DD/YYYY"
								margin="normal"
								id="date-picker-inline"
								value={date}
								onChange={this.onDateChange}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
							/>
						</MuiPickersUtilsProvider>
					</div>
					<div>
						<Fab size={"small"} color={"primary"} onClick={this.nextDate}>
							<KeyboardArrowRight/>
						</Fab>
					</div>
					<div>
						<Button variant={"text"} style={{marginLeft: "1rem"}} color={"primary"} onClick={this.today}>
							Today
						</Button>
					</div>
				</div>
				<div className={styles.gameList}>
					<GameList day={date}/>
				</div>
			</div>
		);
	}
}

export default withRouter(GamesArea);