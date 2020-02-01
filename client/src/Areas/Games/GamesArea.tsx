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
	constructor(props: RouteComponentProps<IGamesAreaParams>)
	{
		super(props);

		this.state = {
			dateString: props.match.params.yyyymmdd || moment("Oct 30, 2019").format("YYYYMMDD")
		};
	}

	public static getDerivedStateFromProps(p: RouteComponentProps<IGamesAreaParams>)
	{
		return {
			dateString: p.match.params.yyyymmdd || moment("Oct 30, 2019").format("YYYYMMDD")
		};
	}

	private onDateChange = (date: moment.Moment, value?: string) =>
	{
		if (date.isValid())
		{
			this.props.history.push(SiteRoutes.Games.resolve({
				yyyymmdd: date.format("YYYYMMDD")
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
				</div>
				<div className={styles.gameList}>
					<GameList day={date}/>
				</div>
			</div>
		);
	}
}

export default withRouter(GamesArea);