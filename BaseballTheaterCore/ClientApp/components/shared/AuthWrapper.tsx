import * as React from "react";
import {AuthContext} from "../Base/AuthContext";


export class AuthWrapper extends React.Component<{}, {}>
{
	public render()
	{
		const authed = AuthContext.Instance.IsAuthenticated;

		if (authed)
		{
			return this.props.children;
		}
		
		return (
			<div className="login-container">
				<img src="/images/logo-circle.png"/>
				<a href="/Auth/Login" className="button">Patreon supporters - log in to access this page</a>
			</div>	
		);
	}
}