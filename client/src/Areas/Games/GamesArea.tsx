import DateFnsUtils from '@date-io/moment';
import { Button } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { EventData, Swipeable } from 'react-swipeable';

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
	const [dateString, setDateString] = useState(params.yyyymmdd || GamesUtils.StartingDate().format("YYYYMMDD"));

	useEffect(() => {
		if (!params.yyyymmdd) {
			history.replaceState(null, null, SiteRoutes.Games.resolve({
				yyyymmdd: dateString
			}))
		}
	}, []);

	useEffect(() => {
		const storedDateString = sessionStorage.getItem(SessionStorageDateStringKey);

		const derivedDateString = params.yyyymmdd || storedDateString || GamesUtils.StartingDate().format("YYYYMMDD");

		sessionStorage.setItem(SessionStorageDateStringKey, derivedDateString);

		setDateString(derivedDateString);
	}, [params.yyyymmdd])

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

		navigate(SiteRoutes.Games.resolve({
			yyyymmdd: nextDate.format("YYYYMMDD")
		}));
	};

	const prevDate = () => {
		const prevDate = moment(dateString).add(-1, "day");

		navigate(SiteRoutes.Games.resolve({
			yyyymmdd: prevDate.format("YYYYMMDD")
		}));
	};

	const today = () => {
		navigate(SiteRoutes.Games.resolve({
			yyyymmdd: moment().format("YYYYMMDD")
		}));
	};

	const onSwiping = (e: EventData) => {
		const absX = Math.abs(e.deltaX);
		const absY = Math.abs(e.deltaY);
		const tx = -e.deltaX / 5;

		setTranslateX(absX > absY ? tx : 0);
	};

	const onSwipedRight = (e: EventData) => {
		const absX = Math.abs(e.deltaX);
		const absY = Math.abs(e.deltaY);
		const actualDeltaX = absX > absY ? absX : 0;

		if (actualDeltaX > window.innerWidth / 3) {
			prevDate();
		}
		else {
			setTranslateX(0);
		}
	};

	const onSwipedLeft = (e: EventData) => {
		const absX = Math.abs(e.deltaX);
		const absY = Math.abs(e.deltaY);
		const actualDeltaX = absX > absY ? absX : 0;

		if (actualDeltaX > window.innerWidth / 3) {
			nextDate();
		}
		else {
			setTranslateX(0);
		}
	};

	const date = moment(dateString);

	const transformStyle = translateX !== 0 ? { transform: `translateX(${translateX}px)` } : undefined;

	return (
		<div className={styles.wrapper}>
			<div className={styles.date}>
				<div>
					<Fab size={"small"} color={"primary"} onClick={prevDate}>
						<KeyboardArrowLeft />
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
							onChange={onDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change date',
							}}
						/>
					</MuiPickersUtilsProvider>
				</div>
				<div>
					<Fab size={"small"} color={"primary"} onClick={nextDate}>
						<KeyboardArrowRight />
					</Fab>
				</div>
				<div>
					<Button variant={"text"} style={{ marginLeft: "1rem" }} color={"primary"} onClick={today}>
						Today
					</Button>
				</div>
			</div>
			<div className={styles.gameList} style={transformStyle}>
				<Swipeable onSwipedLeft={onSwipedLeft} onSwipedRight={onSwipedRight} onSwiping={onSwiping}>
					<GameList day={date} />
				</Swipeable>
			</div>
		</div>
	);
}

export default GamesArea;