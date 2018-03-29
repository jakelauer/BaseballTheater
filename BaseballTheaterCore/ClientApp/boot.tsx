import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import * as React from 'react';
import * as ReactDOM from "react-dom";
import {AppContainer} from "react-hot-loader";
import {Route} from "react-router";
import {BrowserRouter} from "react-router-dom";
import '../Styles/all.scss'
import {AppWrapper} from "./components/Base/AppWrapper";
import {GameDetail} from "./components/GameDetail/game_detail";
import {GameList} from "./components/GameList/game_list";
import {Search} from "./components/Search/search";

function renderApp()
{
	// This code starts up the React app when it runs in a browser. It sets up the routing
	// configuration and injects the app into a DOM element.
	const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
	ReactDOM.render(
		<MuiPickersUtilsProvider utils={MomentUtils}>
			<AppContainer>
				<BrowserRouter basename={baseUrl}>
					<AppWrapper>
						<Route exact path='/' component={GameList}/>
						<Route path="/gameday/:date" component={GameList}/>
						<Route path="/game/:date/:gamePk" component={GameDetail} />
						<Route path="/search/:query" component={Search}/>
					</AppWrapper>
				</BrowserRouter>
			</AppContainer>
		</MuiPickersUtilsProvider>,
		document.getElementById('react-app')
	);
}

renderApp();
