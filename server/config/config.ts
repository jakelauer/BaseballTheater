type Environments = "local" | "beta" | "prod";

declare const __SERVER_ENV__: Environments;
declare const __PORT__: number;

const env = typeof __SERVER_ENV__ !== "undefined" ? __SERVER_ENV__ : "local";
const port = typeof __PORT__ !== "undefined" ? __PORT__ : 8000;

export class Config
{
	public static Environment = env;
	public static Port = port;

	public static get host()
	{
		let host = "https://baseball.theater";

		switch (this.Environment)
		{
			case "local":
				host = "http://jlauer.local:8000";
				break;
			case "prod":
				host = "https://baseball.theater";
				break;
			case "beta":
				host = "https://beta.baseball.theater";
				break;
		}

		return host;
	}
}

