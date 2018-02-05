namespace Theater
{
	interface IAppProps
	{

	}

	interface IAppState
	{
		isLoading: boolean;
		pages: IPageRegister[];
		currentPage: IPageRegister;
	}

	interface IAppDistributorPayload
	{
		isLoading: boolean;
	}

	export class App
	{
		public static Instance = new App();

		public appDistributor = new Utility.Distributor<IAppDistributorPayload>();
		private pages: IPageRegister[] = [];

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
				<AppContainer />,
				document.getElementById("app-container")
			);
		}

		public static startLoading()
		{
			App.Instance.appDistributor.distribute({
				isLoading: true
			});
		}

		public static stopLoading()
		{
			App.Instance.appDistributor.distribute({
				isLoading: false
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

		public componentDidMount()
		{
			Utility.Responsive.Instance.initialize();
			Utility.LinkHandler.Instance.initialize();
			Utility.LinkHandler.Instance.onStateChange = () => this.setCurrentPageState();

			App.Instance.appDistributor.subscribe(payload => this.setLoadingState(payload.isLoading));

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

		public render()
		{
			const patreonLogin = "https://www.patreon.com/oauth2/authorize?response_type=code&client_id=4f3fb1d9df8f53406f60617258e66ef5cba993b1aa72d2e32e66a1b5be0b9008&redirect_uri=https://baseball.theater";

			const renderablePage = this.state.currentPage && this.state.currentPage.page ? this.state.currentPage.page : <div />;

			const loadingClass = this.state.isLoading ? "loading" : "";

			return (
				<div className={`app-container`}>
					<header>
						<div className={`header-content`}>
							<div className={`mobile-menu-trigger`}>
								<i className={`material-icons`}>menu</i>
							</div>
							<a className={`logo-link`} href={`/`}> Baseball Theater
							</a>

							<div className={`right`}>
								<div className={`search`}>
									<input type="text" required/>
									<div className={`label`}>
										<i className={`material-icons`}>search</i> <span>Find games &amp; highlights</span>
									</div>
								</div>
								<a className={`login button`} href={patreonLogin}>
									Log in with Patreon
								</a>
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