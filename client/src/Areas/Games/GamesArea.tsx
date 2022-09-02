import DateFnsUtils from '@date-io/moment';
import { Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';

import { SiteRoutes } from '../../Global/Routes/Routes';
import { GamesUtils } from '../../Utility/GamesUtils';
import { GameList } from './GameList';
import styles from './GamesArea.module.scss';

type IGamesAreaParams = {
	yyyymmdd: string;
}

interface IGamesAreaState {
	dateString: string;
	translateX: number;
}

const SessionStorageDateStringKey = "game-list-date";
const GamesArea: React.FC = () => {

	const params = useParams<IGamesAreaParams>();
	const navigate = useNavigate();
	const [translateX, setTranslateX] = useState(0);

	const yyyymmdd = params.yyyymmdd ?? moment().format("YYYYMMDD");

	const [dateString, setDateString] = useState(yyyymmdd || GamesUtils.StartingDate().format("YYYYMMDD"));

	useEffect(() => {
		if (!yyyymmdd) {
			window.history.replaceState(null, null, SiteRoutes.Games.resolve({
				yyyymmdd: dateString
			}))
		}
	}, [dateString, yyyymmdd]);

	useEffect(() => {
		setDateString(yyyymmdd);
	}, [yyyymmdd]);

	useEffect(() => {
		const storedDateString = sessionStorage.getItem(SessionStorageDateStringKey);

		const derivedDateString = dateString || storedDateString || GamesUtils.StartingDate().format("YYYYMMDD");

		sessionStorage.setItem(SessionStorageDateStringKey, derivedDateString);

		setDateString(derivedDateString);
	}, [dateString])

	const onDateChange = (date: moment.Moment, value?: string) => {
		if (date.isValid()) {
			const newDate = date.format("YYYYMMDD");

			navigate(SiteRoutes.Games.resolve({
				yyyymmdd: newDate
			}));

		}
	};

	const nextDate = () => {
		const nextDate = moment(dateString).add(1, "day");

		return (SiteRoutes.Games.resolve({
			yyyymmdd: nextDate.format("YYYYMMDD")
		}));
	};

	const prevDate = () => {
		const prevDate = moment(dateString).add(-1, "day");

		return (SiteRoutes.Games.resolve({
			yyyymmdd: prevDate.format("YYYYMMDD")
		}));
	};

	const today = () => {
		return (SiteRoutes.Games.resolve({
			yyyymmdd: moment().format("YYYYMMDD")
		}));
	};

	const date = moment(dateString);

	const transformStyle = translateX !== 0 ? { transform: `translateX(${translateX}px)` } : undefined;

	return (
		<div className={styles.wrapper}>
			<div className={styles.date}>
				<div>
					<Link to={prevDate()}>
						<IconButton size={"small"} color={"primary"}>
							<KeyboardArrowLeft />
						</IconButton>
					</Link>
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
							onChange={onDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change date',
							}}
						/>
					</MuiPickersUtilsProvider>
				</div>
				<div>
					<Link to={nextDate()}>
						<IconButton size={"small"} color={"primary"}>
							<KeyboardArrowRight />
						</IconButton>
					</Link>
				</div>
				<div>
					<Link to={today()}>
						<Button variant={"contained"} style={{ marginLeft: "1rem", textDecoration: "none" }} color={"primary"}>
							Today
						</Button>
					</Link>
				</div>
			</div>
			<div className={styles.gameList} style={transformStyle}>
				<GameList day={date} />
			</div>
		</div>
	);
}

export default GamesArea;