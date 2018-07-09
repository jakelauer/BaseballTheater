import {DatePicker, Icon} from 'antd';
import * as moment from "moment/moment";
import * as React from "react";

const {MonthPicker} = DatePicker;

export enum CalendarTypes
{
	Day,
	Month
}

interface ICalendarProps
{
	type: CalendarTypes;
	initialDate: moment.Moment;
	onDateChange: (newDate: moment.Moment) => void;
}

interface ICalendarState
{
	date: moment.Moment;
}

export class Calendar extends React.Component<ICalendarProps, ICalendarState>
{
	constructor(props: ICalendarProps)
	{
		super(props);

		this.state = {
			date: this.props.initialDate
		};
	}

	private getDateForDeltaDays(deltaDays: number)
	{
		const date = this.state.date;
		const newDate = moment(date);
		newDate.add(deltaDays, "d");

		return newDate;
	}

	private getDateForDeltaMonths(deltaMonths: number)
	{
		const date = this.state.date;
		const newDate = moment(date);
		newDate.add(deltaMonths, "M");

		return newDate;
	}

	private changeDate(newDate: moment.Moment)
	{

		this.setState({
			date: newDate
		}, () => this.props.onDateChange(newDate));
	}

	private changeDateDelta(e: React.MouseEvent<HTMLAnchorElement>, delta: number)
	{
		e.preventDefault();

		const newDate = this.props.type === CalendarTypes.Day
			? this.getDateForDeltaDays(delta)
			: this.getDateForDeltaMonths(delta);

		this.changeDate(newDate);
	}

	public render()
	{
		const onClickNext = (e) => this.changeDateDelta(e, 1);
		const onClickPrev = (e) => this.changeDateDelta(e, -1);

		return (
			<div className={`day-nav`}>
				<a className={`prev`} onClick={onClickPrev} href={`javascript:void(0)`}>
					<Icon type="left"/>
				</a>
				{this.props.type === CalendarTypes.Day &&
				<DatePicker value={this.state.date}
							format={"MMM DD, YYYY"}
							onChange={(date: moment.Moment) => this.changeDate(date)}
							allowClear={false}/>
				}
				{this.props.type === CalendarTypes.Month &&
				<MonthPicker
					value={this.state.date}
					onChange={(date: moment.Moment) => this.changeDate(date)}
					placeholder="Select month"/>
				}
				<a className={`next`} onClick={onClickNext} href={`javascript:void(0)`}>
					<Icon type="right"/>
				</a>
			</div>
		);
	}
}
