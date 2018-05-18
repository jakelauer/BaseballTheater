import * as React from 'react';
import * as ReactDOM from "react-dom";
import {AppContainer} from "react-hot-loader";
import {BrowserRouter} from "react-router-dom";
import 'antd/dist/antd.css'
import '../Styles/all.scss'
import * as RoutesModule from './routes';
let routes = RoutesModule.routes;

function renderApp()
{
	setTimeout(() => document.body.classList.add("loaded"), 100);
	// This code starts up the React app when it runs in a browser. It sets up the routing
	// configuration and injects the app into a DOM element.
	const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
	ReactDOM.render(
		<AppContainer>
			<BrowserRouter basename={baseUrl}>
				<BrowserRouter children={ routes } basename={ baseUrl } />
			</BrowserRouter>
		</AppContainer>,
		document.getElementById('react-app')
	);
}

// setTimeout(() => renderApp(), 250);

window.onload = () => renderApp();

if (module.hot) {
	module.hot.accept('./routes', () => {
		routes = require<typeof RoutesModule>('./routes').routes;
		renderApp();
	});
}
