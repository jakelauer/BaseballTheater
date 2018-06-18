import * as React from 'react';
import {Route} from "react-router";
import {AppWrapper} from "./components/Base/AppWrapper";
import {GameList} from "./components/GameList/game_list";
import {Search} from "./components/Search/search";
import {AnalyticsListener} from "./components/Base/AnalyticsListener";
import {GameDetail} from "./components/GameDetail/GameDetail";


export const routes = <AppWrapper>
	<AnalyticsListener>
		<Route exact path='/' component={GameList}/>
		<Route path="/gameday/:date" component={GameList}/>
		<Route path="/game/:date/:gamePk/:tab?" component={GameDetail}/>
		<Route path="/search/:query/:gameIds?" component={Search}/>
	</AnalyticsListener>
</AppWrapper>;