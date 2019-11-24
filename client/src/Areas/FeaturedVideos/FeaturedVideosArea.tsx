import * as React from "react";
import {MlbDataServer, RecapTags, VideoSearchWithMetadata} from "baseball-theater-engine";
import {MlbClientDataFetcher} from "../../Global/Mlb/MlbClientDataFetcher";
import {CircularProgress, Grid} from "@material-ui/core";
import {StringUtils} from "../../Utility/StringUtils";
import {Highlight} from "../../UI/Highlight";
import styles from "../Game/Highlights.module.scss";
import {Route} from "react-router";
import {SiteRoutes} from "../../Global/Routes/Routes";
import {FeaturedVideoPage} from "./FeaturedVideoPage";

interface IFeaturedVideosAreaProps
{
}

interface DefaultProps
{
}

type Props = IFeaturedVideosAreaProps & DefaultProps;
type State = IFeaturedVideosAreaState;

interface IFeaturedVideosAreaState
{
	recapTags: { [K in keyof typeof RecapTags]?: VideoSearchWithMetadata[] };
}

export default class FeaturedVideosArea extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			recapTags: {}
		};
	}

	public render()
	{
		return (
			<React.Fragment>
				<Route path={SiteRoutes.FeaturedVideos.path} component={FeaturedVideoPage} />
			</React.Fragment>
		);
	}
}
