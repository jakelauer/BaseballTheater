type Environments = "local" | "beta" | "prod";

declare const __SERVER_ENV__: Environments;

const env = typeof __SERVER_ENV__ !== "undefined" ? __SERVER_ENV__ : "local";

export class Config
{
	public static Environment = env;

	public static get host()
	{
		let host = "https://baseball.theater";

		switch (this.Environment)
		{
			case "local":
				host = "http://jlauer.local:5000";
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

