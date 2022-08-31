import * as React from 'react';
import { ComponentType } from 'react';
import { Route, Routes } from 'react-router-dom';

import { SiteRoutes } from '../Global/Routes/Routes';
import { ContainerProgress } from '../UI/ContainerProgress';

interface IRoutesProps {
}

interface DefaultProps {
}

type Props = IRoutesProps & DefaultProps;
type State = IRoutesState;

interface IRoutesState {
}

export class RouteContainer extends React.Component<Props, State>
{
	constructor(props: Props) {
		super(props);

		this.state = {};
	}

	public render() {

		return (
			<Routes>
				<Route path={SiteRoutes.ApiTest.path} element={<Suspender importer={() => import("../Areas/ApiTest/ApiTestArea")} />} />
				<Route path={SiteRoutes.GamesRoot.path} element={<Suspender importer={() => import("../Areas/Games/GamesArea")} />} />
				<Route path={SiteRoutes.Games.path} element={<Suspender importer={() => import("../Areas/Games/GamesArea")} />} />
				<Route path={SiteRoutes.Game.path} element={<Suspender importer={() => import("../Areas/Game/GameArea")} />} />
				<Route path={SiteRoutes.GameTab.path} element={<Suspender importer={() => import("../Areas/Game/GameArea")} />} />
				<Route path={SiteRoutes.GameTabDetail.path} element={<Suspender importer={() => import("../Areas/Game/GameArea")} />} />
				<Route path={SiteRoutes.Standings.path} element={<Suspender importer={() => import("../Areas/Standings/StandingsArea")} />} />
				<Route path={SiteRoutes.FeaturedVideos.path} element={<Suspender importer={() => import("../Areas/FeaturedVideos/FeaturedVideosArea")} />} />
				<Route path={SiteRoutes.Teams.path} element={<Suspender importer={() => import("../Areas/Teams/TeamsArea")} />} />
				<Route path={SiteRoutes.Settings.path} element={<Suspender importer={() => import("../Areas/Settings/SettingsArea")} />} />
				<Route path={SiteRoutes.Search.path} element={<Suspender importer={() => import("../Areas/Search/SearchArea")} />} />
				<Route path={SiteRoutes.SearchQuery.path} element={<Suspender importer={() => import("../Areas/Search/SearchArea")} />} />
				<Route path={SiteRoutes.SearchDate.path} element={<Suspender importer={() => import("../Areas/Search/SearchArea")} />} />
				<Route path={"/"} element={<Suspender importer={() => import("../Areas/Games/GamesArea")} />} />
			</Routes>
		);
	}
}

const Suspender: React.FC<{ importer: () => Promise<{ default: ComponentType<any> }> }> = ({ importer }) => {
	const LazyComponent = React.lazy(importer);

	return (
		<React.Suspense fallback={<ContainerProgress />}>
			<LazyComponent />
		</React.Suspense>
	);
};