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
	}

	interface ILoadingDistributor
	{
		isLoading: boolean;
	}

	export class App
	{
		public static Instance = new App();

		public loadingDistributor = new Utility.Distributor<ILoadingDistributor>();

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
			ReactDOM.render(
				<AppContainer isAppMode={this.isAppMode} />,
				document.getElementById("app-container")
			);
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
				currentPage: null
			}
		}

		public componentWillMount()
		{
			Utility.Responsive.Instance.initialize();
			Utility.LinkHandler.Instance.initialize();
			Utility.LinkHandler.Instance.stateChangeDistributor.subscribe(() => this.setCurrentPageState());
			AuthContext.Instance.initialize();

			App.Instance.loadingDistributor.subscribe(payload => this.setLoadingState(payload.isLoading));

			this.setCurrentPageState();
			this.registerHub();
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

		private registerHub()
		{
			const chat = $.connection.liveGameHub;

			chat.client.receive = (message) =>
			{
				console.log("received", message);
			};

			$.connection.hub.start().done(() =>
			{
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
		}

		private renderLoginButton()
		{
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

		public render()
		{

			let renderablePage: React.ReactElement<any> | null = null;

			const currentPage = this.state.currentPage;
			if (currentPage)
			{
				renderablePage = currentPage.page;
			}

			const loadingClass = this.state.isLoading ? "loading" : "";
			const appModeClass = this.props.isAppMode ? "app-mode" : "";

			return (
				<div className={`app-container ${appModeClass}`}>
					<header>
						<div className={`header-content`}>
							<a className={`logo-link`} href={`/`}> 
								<span className={`logo-circle`}></span>
								<span className={`logo-text`}>Baseball Theater</span>
							</a>

							<div className={`right`}>
								<SearchBox />
								{this.renderLoginButton()}
							</div>
						</div>
					</header>
					<div id="body-wrapper" className={loadingClass}>
						<div className={`loading-spinner`}>
							<img src={`/images/ring.svg`} />
						</div>
						<div id="body-content">
							{renderablePage}
						</div>
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