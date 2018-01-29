namespace Theater
{
	interface ICalendarProps
	{
		initialDate: moment.Moment;
		onDateChange: (newDate: moment.Moment) => void;
	}

	interface ICalendarState
	{
		date: moment.Moment;
	}

	export class Calendar extends React.Component<ICalendarProps, any>
	{
		private pikaday: any;

		constructor(props: ICalendarProps)
		{
			super(props);

			this.state = {
				date: this.props.initialDate
			};
		}

		public componentDidMount(): void
		{
			this.pikaday = new Pikaday({
				field: $("#calendarpicker")[0],
				format: "MMM DD, YYYY",
				onSelect: (date) =>
				{
					const newDate = moment(date);

					this.changeDate(newDate);
				}
			});
		}

		private showCalendar = () =>
		{
			this.pikaday.show();
		}

		private getUrlForDateChangeDelta(deltaDays: number)
		{
			const newDate = this.getDateforChangeDelta(deltaDays);
			return this.getUrlForDate(newDate);
		}

		private getUrlForDate(newDate: moment.Moment)
		{
			return `/${newDate.format("YYYYMMDD")}`;
		}

		private getDateforChangeDelta(deltaDays: number)
		{
			const date = this.state.date;
			const newDate = moment(date);
			newDate.add(deltaDays, "d");

			return newDate;
		}

		private changeDate(newDate: moment.Moment)
		{
			const newUrl = this.getUrlForDate(newDate);

			App.LinkHandler.pushState(newUrl);
			this.setState({
				date: newDate
			}, () => this.props.onDateChange(newDate));
		}

		private changeDateDelta(e: React.MouseEvent<HTMLAnchorElement>, deltaDays: number)
		{
			e.preventDefault();

			const newDate = this.getDateforChangeDelta(deltaDays);

			this.changeDate(newDate);
		}

		private getFriendlyDate()
		{
			const date = this.state.date;
			const newDate = moment(date);
			return newDate.format("MMM DD, YYYY");
		}

		public render()
		{
			const friendlyDate = this.getFriendlyDate();
			const onClickNext = (e) => this.changeDateDelta(e, 1);
			const onClickPrev = (e) => this.changeDateDelta(e, -1);
			const nextButtonUrl = this.getUrlForDateChangeDelta(1);
			const prevButtonUrl = this.getUrlForDateChangeDelta(-1);
			const inputSize = this.getFriendlyDate().length + 1;

			return (
				<div className={`day-nav`}>
					<a onClick={onClickPrev} href={prevButtonUrl}>
						<i className={`fa fa-chevron-circle-left`}></i>
					</a>
					<input type={`text`} id={`calendarpicker`} value={friendlyDate} size={inputSize} readOnly/>
					<i className={`fa fa-calendar`} aria-hidden={`true`} onClick={this.showCalendar} ></i>
					<a onClick={onClickNext} href={nextButtonUrl}>
						<i className={`fa fa-chevron-circle-right`}></i>
					</a>
				</div>
			);
		}
	}
}