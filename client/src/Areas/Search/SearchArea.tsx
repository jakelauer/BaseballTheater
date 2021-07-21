import * as React from "react";
import {useEffect, useState} from "react";
import {Grid, Input, InputAdornment, Theme} from "@material-ui/core";
import styles from "./SearchArea.module.scss";
import {makeStyles} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";
import {RouteComponentProps, withRouter} from "react-router";
import Typography from "@material-ui/core/Typography";
import {ChromecastFab} from "../../UI/ChromecastFab";
import {NewSearch} from "./NewSearch";
import moment from "moment/moment";
import {FaSearch} from "react-icons/all";

export interface ISearchAreaParams
{
	query: string;
	date: string;
}

interface ISearchAreaProps extends RouteComponentProps<ISearchAreaParams>
{
}

interface DefaultProps
{
}

type Props = ISearchAreaProps & DefaultProps;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: '4px 12px',
			display: 'flex',
			alignItems: 'center',
			width: 450,
			margin: "2rem"
		},
		input: {
			marginLeft: theme.spacing(1),
			flex: 1,
			width: "100%"
		},
	}),
);

let timerId = 0;
const SearchArea: React.FC<Props> = (props) =>
{
	const dateString = moment(decodeURIComponent(props.match.params.date)).format("MMMM Do, YYYY");

	const {
		date,
		query
	} = props.match.params;

	const prepopulated = (date && query) ? {
		tag: props.match.params.query,
		date: props.match.params.date
	} : undefined;

	const [tempText, setTempText] = useState("");
	const [textQuery, setTextQuery] = useState("");

	const delayedSetText = (value: string) =>
	{
		setTempText(value);
	}

	useEffect(() =>
	{
		clearTimeout(timerId);
		timerId = window.setTimeout(() => setTextQuery(tempText), 250);
	}, [tempText]);

	return (
		<div className={styles.wrapper} style={{marginTop: props.match.params.date ? "2rem" : "0"}}>
			{date && (
				<Grid container className={styles.rest} spacing={3} style={{paddingLeft: 0, marginBottom: "2rem"}}>
					<Typography variant={"h4"}>{dateString}: {props.match.params.query}</Typography>
				</Grid>
			)}

			{!prepopulated && (
				<Grid container className={styles.rest} spacing={3}>
					<Grid item xs={12} style={{
						padding: "40px 30px"
					}}>
						<Input
							id="input-with-icon-adornment"
							value={tempText}
							style={{
								width: "100%"
							}}
							placeholder={"Search for videos..."}
							inputProps={{
								onChange: e => delayedSetText((e.target as any).value)
							}}
							startAdornment={
								<InputAdornment position="start">
									<FaSearch/>
								</InputAdornment>
							}
						/>
					</Grid>
				</Grid>
			)}

			<NewSearch query={textQuery} prepopulated={prepopulated}/>

			<ChromecastFab/>
		</div>
	);
};

export default withRouter(SearchArea);