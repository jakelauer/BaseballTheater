import { MediaItem, RecapTags } from 'baseball-theater-engine';
import * as React from 'react';
import { Route } from 'react-router';

import { SiteRoutes } from '../../Global/Routes/Routes';
import { FeaturedVideoPage } from './FeaturedVideoPage';

interface IFeaturedVideosAreaProps {
}

interface DefaultProps {
}

type Props = IFeaturedVideosAreaProps & DefaultProps;
type State = IFeaturedVideosAreaState;

interface IFeaturedVideosAreaState {
	recapTags: { [K in keyof typeof RecapTags]?: MediaItem[] };
}

export default class FeaturedVideosArea extends React.Component<Props, State>
{
	constructor(props: Props) {
		super(props);

		this.state = {
			recapTags: {}
		};
	}

	public render() {
		return (
			<React.Fragment>
				<Route path={SiteRoutes.FeaturedVideos.path}>
					<FeaturedVideoPage />
				</Route>
			</React.Fragment>
		);
	}
}
