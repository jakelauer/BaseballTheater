import moment from "moment";

export class GamesUtils
{
	public static StartingDate = () =>
	{
		const today = moment();
		const lastSeasonEnd = moment("2019-10-30");
		const nextOpeningDate = moment("2020-02-19");

		return nextOpeningDate.isAfter(today) ? lastSeasonEnd : today;
	}
}