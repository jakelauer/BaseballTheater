import {useDataStore} from "../Utility/HookUtils";
import {ChromecastDataStore} from "../Areas/Game/Components/ChromecastDataStore";
import {AuthDataStore, BackerType} from "../Global/AuthDataStore";
import {RespondDataStore, RespondSizes} from "../Global/Respond/RespondDataStore";
import {Fab} from "@material-ui/core";
import {ChromecastUtils} from "../Utility/ChromecastUtils";
import * as React from "react";

export const ChromecastFab = () =>
{
	const chromecastData = useDataStore(ChromecastDataStore);
	const authData = useDataStore(AuthDataStore);
	const respondData = useDataStore(RespondDataStore);

	if (!chromecastData.available)
	{
		return null;
	}

	const isPro = AuthDataStore.hasLevel(BackerType.ProBacker);

	return (
		<Fab color="primary" aria-label="add" style={{
			position: "fixed",
			bottom: respondData.sizes.includes(RespondSizes.medium) ? "5rem" : "1rem",
			right: "1rem"
		}}>
			<div onClick={e => ChromecastUtils.hijackCastClick(e)} style={{
				position: "absolute",
				zIndex: 10,
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				cursor: "pointer",
				pointerEvents: isPro ? "none" : "auto"
			}}/>
			<div style={{
				position: "relative",
				width: "60%",
				height: "60%",
				display: "flex",
				color: "white",
				zIndex: 5
			}} dangerouslySetInnerHTML={{__html: "<google-cast-launcher style='--disconnected-color: white;'</google-cast-launcher>"}}/>
		</Fab>
	);
}