import * as React from "react";
import {ComponentType} from "react";
import {Redirect, Route, Switch} from "react-router";
import {SiteRoutes} from "../Global/Routes/Routes";
import {ContainerProgress} from "../UI/ContainerProgress";

interface IRoutesProps
{
}

interface DefaultProps
{
}

type Props = IRoutesProps & DefaultProps;
type State = IRoutesState;

interface IRoutesState
{
}

export class Routes extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {};
	}

	public render()
	{
		return (
			<Switch>
				<Route path={SiteRoutes.ApiTest.path}>
					<Suspender importer={() => import("../Areas/ApiTest/ApiTestArea")}/>
				</Route>
				<Route path={SiteRoutes.Games.path}>
					<Suspender importer={() => import("../Areas/Games/GamesArea")}/>
				</Route>
				<Route path={SiteRoutes.Game.path}>
					<Suspender importer={() => import("../Areas/Game/GameArea")}/>
				</Route>
				<Route path={SiteRoutes.Standings.path}>
					<Suspender importer={() => import("../Areas/Standings/StandingsArea")}/>
				</Route>
				<Route path={SiteRoutes.FeaturedVideos.path}>
					<Suspender importer={() => import("../Areas/FeaturedVideos/FeaturedVideosArea")}/>
				</Route>
				<Route path={SiteRoutes.Teams.path}>
					<Suspender importer={() => import("../Areas/Teams/TeamsArea")}/>
				</Route>
				<Route path={SiteRoutes.Settings.path}>
					<Suspender importer={() => import("../Areas/Settings/SettingsArea")}/>
				</Route>
				<Route exact path={"/"}>
					<Redirect to={SiteRoutes.Games.resolve()}/>
				</Route>
			</Switch>
		);
	}
}

const Suspender: React.FC<{ importer: () => Promise<{ default: ComponentType<any> }> }> = ({importer}) =>
{
	const LazyComponent = React.lazy(importer);

	return (
		<React.Suspense fallback={<ContainerProgress/>}>
			<LazyComponent/>
		</React.Suspense>
	);
};