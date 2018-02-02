namespace Theater
{
	export class App extends React.Component
	{
		public render()
		{
			const patreonLogin = "https://www.patreon.com/oauth2/authorize?response_type=code&client_id=4f3fb1d9df8f53406f60617258e66ef5cba993b1aa72d2e32e66a1b5be0b9008&redirect_uri=https://baseball.theater";

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
					<div id="body-wrapper">
						<div className={`loading-spinner`}>
							<img src={`/images/ring.svg`}/>
						</div>
						<div id="body-content">
						</div>
					</div>
				</div>
			);
		}
	}
}