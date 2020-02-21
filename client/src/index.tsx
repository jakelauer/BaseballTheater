import React from 'react';
import ReactDOM from 'react-dom';
import "styles/base.scss";
import * as serviceWorker from './serviceWorker';
import App from "./App/App";
import {BrowserRouter} from "react-router-dom";
import {grey} from "@material-ui/core/colors";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {MuiThemeProvider} from "@material-ui/core";
import {SimplePaletteColorOptions} from "@material-ui/core/styles";
import * as Sentry from '@sentry/browser';
import ReactGA from 'react-ga';

if (!location.hostname.includes("local"))
{
	Sentry.init({dsn: "https://393ba71c737f4a80be4ad5b33770f8b6@sentry.io/2696988"});
	ReactGA.initialize('UA-23730353-4');
}

const visits = JSON.parse(localStorage.getItem("visits") ?? "0");
localStorage.setItem("visits", visits + 1);

const primary: SimplePaletteColorOptions = {
	main: "#ce0f0f",
	contrastText: "#FFFFFF",
	dark: "#ad0e0e",
	light: "#f70707"
};

const theme = createMuiTheme({
	palette: {
		primary,
		secondary: grey,
	},
});

ReactDOM.render(
	<BrowserRouter>
		<MuiThemeProvider theme={theme}>
			<App/>
		</MuiThemeProvider>
	</BrowserRouter>
	, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();