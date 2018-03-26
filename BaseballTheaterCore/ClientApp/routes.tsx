import * as React from 'react';
import {Route} from 'react-router-dom';
import {AppWrapper} from "./components/Base/app"
import {GameDetail} from "./components/GameDetail/game_detail";
import {GameList} from "./components/GameList/game_list";
import {Search} from "./components/Search/search";

export const routes = <AppWrapper isAppMode={false}>
	<Route exact path='/' component={GameList}/>
	<Route path="/:date" component={GameList}/>
	<Route path="/game/:date/:gamePk" component={GameDetail}/>
	<Route path="/search/:query" component={Search}/>
</AppWrapper>;