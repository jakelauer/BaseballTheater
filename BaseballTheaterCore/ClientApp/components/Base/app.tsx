import * as Cookies from "js-cookie";
import * as React from "react";
import {Link} from "react-router-dom";
import {hubConnection} from "signalr-no-jquery";
import {ISettings, SettingsDispatcher} from "../../DataStore/SettingsDispatcher";
import {Responsive} from "../../Utility/responsive";
import {Distributor} from "../../Utility/subscribable";
import {Config} from "../shared/config";
import {Modal} from "../shared/modal";
import {AuthContext} from "./auth_context";
import {SearchBox} from "./SearchBox";
import {SettingsContainer} from "./Settings";
import {SettingsButton} from "./SettingsButton";

interface IAppProps
{
	children?: React.ReactNode;
	isAppMode: boolean;
}

interface IAppState
{
	isLoading: boolean;
	isSettingsModalOpen: boolean;
	settings: ISettings;
}

export interface ILoadingPayload
{
	isLoading: boolean;
}

export interface IGameUpdateDistributorPayload
{
	gameIds: number[]
}

export class App
{
	public static Instance = new App();

	public settingsDispatcher = new SettingsDispatcher({
		defaultTab: Cookies.get("defaulttab") || "",
		favoriteTeam: Cookies.get("favoriteteam") || "",
		hideScores: Cookies.get("hidescores") === "true"
	});
	public loadingDistributor = new Distributor<ILoadingPayload>();
	public gameUpdateDistributor = new Distributor<IGameUpdateDistributorPayload>();

	private static _isLoading = false;
	public static get isLoading()
	{
		return this._isLoading;
	}

	public get isAppMode()
	{
		return false;
		//const queries = LinkHandler.parseQuery();
		//return "app" in queries && queries["app"] === "true";
	}

	public initialize()
	{
		this.registerHub();
	}

	private registerHub()
	{
		if (!Config.liveDataEnabled)
		{
			return null;
		}

		const connection = hubConnection("/signalr", {useDefaultPath: false});
		const hubProxy = connection.createHubProxy('liveGameHub');

		hubProxy.on('receive', (gameIds: number[]) =>
		{
			console.log("Received gameIds update", gameIds);

			this.gameUpdateDistributor.distribute({
				gameIds
			});
		});

		connection.start({jsonp: true})
			.done(function ()
			{
				console.log('Now connected, connection ID=' + connection.id);
			})
			.fail(function ()
			{
				console.log('Could not connect');
			});

	}

	public static startLoading()
	{
		this._isLoading = true;
		App.Instance.loadingDistributor.distribute({
			isLoading: this.isLoading
		});
	}

	public static stopLoading()
	{
		this._isLoading = false;
		App.Instance.loadingDistributor.distribute({
			isLoading: this.isLoading
		});
	}
}


export class AppWrapper extends React.Component<IAppProps, IAppState>
{
	private settingsDispatcherKey: string;

	constructor(props: IAppProps)
	{
		super(props);

		this.state = {
			isLoading: false,
			isSettingsModalOpen: false,
			settings: {
				favoriteTeam: "",
				defaultTab: "",
				hideScores: false
			}
		}
	}

	public componentWillMount()
	{
		Responsive.Instance.initialize();
		//LinkHandler.Instance.initialize();
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
			const redirect = `${location.origin}/Auth`;
			const patreonLogin = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=4f3fb1d9df8f53406f60617258e66ef5cba993b1aa72d2e32e66a1b5be0b9008&redirect_uri=${redirect}`;

			return (
				<a className={`login button`} href={patreonLogin}>
					Patreon Login
				</a>
			);
		}

		return (
			<a href={`/Auth/Logout`}>Log Out</a>
		);
	}

	private toggleSettingsModal(isSettingsModalOpen: boolean)
	{
		this.setState({
			isSettingsModalOpen
		});
	}

	public render()
	{
		const loadingClass = this.state.isLoading ? "loading" : "";
		const appModeClass = this.props.isAppMode ? "app-mode" : "";

		return (
			<div className={`app-container ${appModeClass}`}>
				<header>
					<div className={`header-content`}>
						<Link className={`logo-link`} to={`/`}>
							<span className={`logo-circle`}/>
							<span className={`logo-text`}>Baseball Theater</span>
						</Link>

						<div className={`right`}>
							<SearchBox/>
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
								<strong>Like the site?</strong> It costs money to run! Help me keep the site alive:
							</div>
							<div className={`patreon-button`}>
								<a href="https://www.patreon.com/bePatron?u=5206592" data-patreon-widget-type="become-patron-button">Become a Patron!</a>
							</div>
						</div>
					</div>

					<Modal id={`settings`}
						   isOpen={this.state.isSettingsModalOpen}
						   onClose={() => this.toggleSettingsModal(false)}>

						<SettingsContainer settings={this.state.settings}/>

					</Modal>
				</div>
			</div>
		);
	}
}