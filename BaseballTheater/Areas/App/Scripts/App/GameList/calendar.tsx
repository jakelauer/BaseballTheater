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

	export class Calendar extends React.Component<ICalendarProps, ICalendarState>
	{
		private pikaday: any;

		constructor(props: ICalendarProps)
		{
			super(props);

			this.state = {
				date: this.props.initialDate
			};
		}

		public componentDidMount()
		{
			this.pikaday = new Pikaday({
				field: $("#calendarpicker")[0],
				format: "MMM DD, YYYY",
				onSelect: (date) =>
				{
					const newDate = moment(date);
					
					if (!newDate.isSame(this.state.date))
					{
						this.changeDate(newDate);
					}
				}
			});
		}

		public componentWillReceiveProps(nextProps: Readonly<ICalendarProps>)
		{
			if (nextProps.initialDate !== this.state.date)
			{
				this.pikaday.setMoment(nextProps.initialDate)
			}
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

			Utility.LinkHandler.pushState(newUrl);
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
			const inputSize = this.getFriendlyDate().length + 1;

			return (
				<div className={`day-nav`}>
					<a className={`prev`} onClick={onClickPrev} href={`javascript:void(0)`}>
						<i className={`material-icons`}>chevron_left</i>
					</a>
					<input type={`text`} id={`calendarpicker`} value={friendlyDate} size={inputSize} readOnly/>
					<a className={`next`} onClick={onClickNext} href={`javascript:void(0)`}>
						<i className={`material-icons`}>chevron_right</i>
					</a>
				</div>
			);
		}
	}
}