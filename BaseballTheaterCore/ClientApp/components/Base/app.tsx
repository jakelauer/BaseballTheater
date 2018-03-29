import * as Cookies from "js-cookie";
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";
import {hubConnection} from "signalr-no-jquery";
import {ISettings, SettingsDispatcher} from "../../DataStore/SettingsDispatcher";
import {Responsive} from "../../Utility/responsive";
import {Distributor} from "../../Utility/subscribable";
import {Search} from "../Search/search";
import {Config} from "../shared/config";
import {Modal} from "../shared/modal";
import {AuthContext} from "./auth_context";
import {SearchBox} from "./SearchBox";
import {SettingsContainer} from "./Settings";
import {SettingsButton} from "./SettingsButton";

interface IAppProps
{
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
