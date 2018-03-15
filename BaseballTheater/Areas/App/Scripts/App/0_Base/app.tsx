namespace Theater
{
	interface IAppProps
	{
		isAppMode: boolean;
	}

	interface IAppState
	{
		isLoading: boolean;
		pages: IPageRegister[];
		currentPage: IPageRegister | null;
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

		public loadingDistributor = new Utility.Distributor<ILoadingPayload>();
		public gameUpdateDistributor = new Utility.Distributor<IGameUpdateDistributorPayload>();
		public settingsDistributor = new Utility.Distributor<ISettings>();

		private pages: IPageRegister[] = [];

		private static _isLoading = false;
		public static get isLoading()
		{
			return this._isLoading;
		}

		public get isAppMode()
		{
			const queries = Utility.LinkHandler.parseQuery();
			return "app" in queries && queries["app"] === "true";
		}

		public get allpages()
		{
			return this.pages;
		}

		public addPage(params: IPageRegister)
		{
			this.pages.push(params);
		};

		public initialize()
		{
			this.registerHub();

			ReactDOM.render(
				<AppContainer isAppMode={this.isAppMode}/>,
				document.getElementById("app-container")
			);
		}

		private registerHub()
		{
			if (!Config.liveDataEnabled)
			{
				return null;
			}

			const chat = $.connection.liveGameHub;

			chat.client.receive = (gameIds: number[]) =>
			{
				console.log("Received gameIds update", gameIds);

				this.gameUpdateDistributor.distribute({
					gameIds
				});
			};

			$.connection.hub.start().done(() =>
			{
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


	export class AppContainer extends React.Component<IAppProps, IAppState>
	{
		private pages: IPageRegister[] = [];

		constructor(props: IAppProps)
		{
			super(props);

			this.state = {
				isLoading: false,
				pages: [],
				currentPage: null,
				isSettingsModalOpen: false,
				settings: {
					defaultTab: Cookies.get("defaulttab"),
					favoriteTeam: Cookies.get("favoriteteam"),
					hideScores: Cookies.get("hidescores") === true
				}
			}
		}

		public componentWillMount()
		{
			Utility.Responsive.Instance.initialize();
			Utility.LinkHandler.Instance.initialize();
			Utility.LinkHandler.Instance.stateChangeDistributor.subscribe(() => this.setCurrentPageState());
			AuthContext.Instance.initialize();

			App.Instance.loadingDistributor.subscribe(payload => this.setLoadingState(payload.isLoading));
			App.Instance.settingsDistributor.subscribe(settings => this.setState({
				settings
			}));

			this.setCurrentPageState();
		}

		public addPage(params: IPageRegister)
		{
			this.pages.push(params);
		};

		private setLoadingState(isLoading: boolean)
		{
			this.setState({
				isLoading
			});
		}

		private setCurrentPageState()
		{
			const pages = App.Instance.allpages;

			for (let page of pages)
			{
				if (page.matchingUrl.test(location.pathname))
				{
					this.setState({
						currentPage: page
					});
				}
			}

			window.scrollTo(0, 0);
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

			let renderablePage: React.ReactElement<any> | null = null;

			const currentPage = this.state.currentPage;
			if (currentPage)
			{
				renderablePage = currentPage.page({
					settings: this.state.settings
				});
			}

			const loadingClass = this.state.isLoading ? "loading" : "";
			const appModeClass = this.props.isAppMode ? "app-mode" : "";

			return (
				<div className={`app-container ${appModeClass}`}>
					<header>
						<div className={`header-content`}>
							<a className={`logo-link`} href={`/`}>
								<span className={`logo-circle`}/>
								<span className={`logo-text`}>Baseball Theater</span>
							</a>

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
							{renderablePage}
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

	$(document).ready(() =>
	{
		App.Instance.initialize();
	});
}