import * as React from 'react';
import {Route} from "react-router";
import {AppWrapper} from "./components/Base/AppWrapper";
import {GameDetail} from "./components/GameDetail/game_detail";
import {GameList} from "./components/GameList/game_list";
import {Search} from "./components/Search/search";

export const routes = <AppWrapper>
	<Route exact path='/' component={GameList}/>
	<Route path="/gameday/:date" component={GameList}/>
	<Route path="/game/:date/:gamePk/:tab?" component={GameDetail}/>
	<Route path="/search/:query" component={Search}/>
</AppWrapper>;