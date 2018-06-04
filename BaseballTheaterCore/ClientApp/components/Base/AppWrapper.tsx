import * as PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {ISettings} from "../../DataStore/SettingsDispatcher";
import {Responsive} from "../../Utility/responsive";
import Config from "../Config/config";
import {Search} from "../Search/search";
import {Modal} from "antd";
import {App} from "./app";
import {AuthContext} from "./AuthContext";
import {SearchBox} from "./SearchBox";
import {SettingsContainer} from "./Settings";
import {SettingsButton} from "./SettingsButton";
import React = require("react");


interface IAppState
{
	isLoading: boolean;
	isSettingsModalOpen: boolean;
	settings: ISettings;
}

export class AppWrapper extends React.Component<{}, IAppState>
{
	private settingsDispatcherKey: string;

	constructor(props: {})
	{
		super(props);

		this.state = {
			isLoading: false,
			isSettingsModalOpen: false,
			settings: {
				favoriteTeam: [""],
				defaultTab: "",
				hideScores: false
			}
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	public componentWillMount()
	{
		Responsive.Instance.initialize();
		AuthContext.Instance.initialize();
		App.Instance.initialize();

		App.Instance.loadingDistributor.subscribe(payload => this.setLoadingState(payload.isLoading));
		this.settingsDispatcherKey = App.Instance.settingsDispatcher.register(settings => this.setState({
			settings
		}));
	}

	public componentWillUnmount()
	{
		App.Instance.settingsDispatcher.deregister(this.settingsDispatcherKey);
	}

	private setLoadingState(isLoading: boolean)
	{
		this.setState({
			isLoading
		});
	}

	private renderLoginButton()
	{
		if (!Config.loginEnabled)
		{
			return null;
		}

		const isAuthenticated = AuthContext.Instance.IsAuthenticated;
		if (!isAuthenticated)
		{
			const patreonLogin = `/Auth/Login`;

			return (
				<a className={`login button`} href={patreonLogin}>
					Patreon Login
				</a>
			);
		}

		return (
			<a className={`login button`} href={`/Auth/Logout`}>Log Out</a>
		);
	}

	private toggleSettingsModal(isSettingsModalOpen: boolean)
	{
		this.setState({
			isSettingsModalOpen
		});
	}

	private performSearch(query: string)
	{
		this.context.router.history.push(`/Search/${query}`)
	}

	public render()
	{
		const loadingClass = this.state.isLoading ? "loading" : "";
		const appModeClass = "";//this.props.isAppMode ? "app-mode" : "";
		const search = Search.getQuery();

		return (
			<div className={`app-container ${appModeClass}`}>
				<header>
					<div className={`header-content`}>
						<Link className={`logo-link`} to={`/`}>
							<span className={`logo-circle`}/>
							<span className={`logo-text`}>Baseball Theater</span>
						</Link>

						<div className={`right`}>
							<SearchBox query={search} onPerformSearch={query => this.performSearch(query)}/>
							<SettingsButton onSettingsClicked={() => this.toggleSettingsModal(true)}/>
							{this.renderLoginButton()}
						</div>
					</div>
				</header>
				<div id="body-wrapper" className={loadingClass}>
					<div className={`loading-spinner`}>
						<img src={`/images/ring.svg`}/>
					</div>
					<div id="body-content">
						{this.props.children}
					</div>

					<div className={`footer`}>
						<span>Created by</span>&nbsp;
						<a href="https://github.com/jakelauer" target={`_blank`}>Jake Lauer</a>
						&nbsp;(<a href="https://www.reddit.com/user/HelloControl_/" target={`_blank`}>HelloControl_</a>)

						<div className={`shameless-plug`}>
							<div>
								<strong>Like the site?</strong> <br/>
								<a href="https://www.patreon.com/jakelauer/memberships" target="_blank">Become a patron to keep it alive!</a>
							</div>
						</div>
					</div>

					<Modal className={`settings-modal`} visible={this.state.isSettingsModalOpen}
						   onCancel={() => this.toggleSettingsModal(false)}>

						<SettingsContainer settings={this.state.settings}/>

					</Modal>
				</div>
			</div>
		);
	}
}