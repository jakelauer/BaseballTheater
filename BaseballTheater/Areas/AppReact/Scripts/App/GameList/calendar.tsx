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

	export class CalendarReact extends React.Component<ICalendarProps, any>
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

		private changeDate(newDate: moment.Moment)
		{
			const newUrl = `/react/${newDate.format("YYYYMMDD")}`;

			SiteReact.LinkHandler.pushState(newUrl);
			this.setState({
				date: newDate
			});
			this.props.onDateChange(newDate);
		}

		private changeDateDelta(_, deltaDays: number)
		{
			const date = this.state.date;
			const newDate = moment(date).add("d", deltaDays);

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
			return (
				<div className={`day-nav`}>
					<a onClick={e => this.changeDateDelta(e, -1)}>
						<i className={`fa fa-chevron-circle-left`}></i>
					</a>
					<input type={`text`} id={`calendarpicker`} value={this.getFriendlyDate()} size={this.getFriendlyDate().length + 1}/>
					<i className={`fa fa-calendar`} aria-hidden={`true`} onClick={this.showCalendar} ></i>
					<a onClick={e => this.changeDateDelta(e, 1)}>
						<i className={`fa fa-chevron-circle-right`}></i>
					</a>
				</div >
			);
		}
	}
}