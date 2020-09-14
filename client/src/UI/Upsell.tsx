import * as React from "react";
import {BackerType} from "../Global/AuthDataStore";
import {Button, Typography} from "@material-ui/core";
import styles from "./Upsell.module.scss";
import withStyles from "@material-ui/core/styles/withStyles";
import classNames from "classnames";
import DialogActions from "@material-ui/core/DialogActions";
import {AiOutlineCloseCircle} from "react-icons/all";

interface IUpsellProps
{
	levelRequired: BackerType;
	isModal: boolean;
	hideClose?: boolean;
	onCancel?: () => void;
	titleOverride?: React.ReactNode;
}

interface DefaultProps
{
}

type Props = IUpsellProps & DefaultProps;
type State = IUpsellState;

interface IUpsellState
{
}

const PatreonButton = withStyles({
	root: {
		backgroundColor: "#f96854",
		"&:hover": {
			backgroundColor: "#ff8777"
		}
	},
})(Button);

export class Upsell extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {};
	}

	private get patreonUrl()
	{
		const clientId = "4f3fb1d9df8f53406f60617258e66ef5cba993b1aa72d2e32e66a1b5be0b9008";
		const host = location.hostname === "jlauer.local" ? "jlauer.local:5000" : location.hostname;
		const protocol = location.hostname === "jlauer.local" ? "http:" : "https:";
		const redirectUri = `${protocol}//${host}/auth/redirect`;
		const scopes = ["users", "pledges-to-me", "my-campaign"];
		const state = encodeURIComponent(location.pathname);
		return `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join(" ")}&state=${state}`;
	}

	public render()
	{
		const classes = classNames(styles.wrapper, {
			[styles.isModal]: this.props.isModal
		});

		const title = this.props.titleOverride || (
			<React.Fragment>
				This feature is reserved for <strong>{this.props.levelRequired}s</strong>
			</React.Fragment>
		);

		return (
			<>
				{!this.props.hideClose && (
					<div className={styles.close} onClick={this.props.onCancel}>
						<AiOutlineCloseCircle/>
					</div>
				)}
				<div className={classes}>
					<div className={styles.inner}>
						<Typography variant={"h5"} className={styles.title}>
							{title}
						</Typography>
						<Typography>
							Baseball Theater is fan-funded by Patreon donations. If you enjoy the site, please consider joining to help keep the site alive!
						</Typography>
					</div>
				</div>
				<DialogActions>
					<a className={styles.patreonButtonLink} href={"https://www.patreon.com/jakelauer"} target={"_blank"} rel={"nofollow noreferrer"}>
						<PatreonButton className={styles.patreonJoin}>
							Become a Patron
						</PatreonButton>
					</a>
					<a className={styles.patreonButtonLink} href={this.patreonUrl}>
						<PatreonButton onClick={this.props.onCancel} style={{backgroundColor: "#EEE", margin: 8}}>Log In</PatreonButton>
					</a>
				</DialogActions>
			</>
		);
	}
}