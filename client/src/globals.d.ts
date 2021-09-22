declare module "react-router-scroll-memory";

interface BeforeInstallPromptEvent extends Event
{

	/**
	 * Returns an array of DOMString items containing the platforms on which the event was dispatched.
	 * This is provided for user agents that want to present a choice of versions to the user such as,
	 * for example, "web" or "play" which would allow the user to chose between a web version or
	 * an Android version.
	 */
	readonly platforms: Array<string>;

	/**
	 * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
	 */
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed',
		platform: string
	}>;

	/**
	 * Allows a developer to show the install prompt at a time of their own choosing.
	 * This method returns a Promise.
	 */
	prompt(): Promise<void>;

}

declare module "react-router-transition"
{
	import {RouteProps} from "react-router";

	interface AnimatedSwitchProps
	{
		atEnter: React.CSSProperties;
		atLeave: React.CSSProperties;
		atActive: React.CSSProperties;
		didLeave?: (style: React.CSSProperties) => void;
		className?: HTMLDivElement;
		wrapperComponent?: keyof HTMLElementTagNameMap;
		mapStyles?: (styles: React.CSSProperties) => React.CSSProperties;
		runOnMount?: boolean;
		children: React.ReactNode;
	}

	interface AnimatedRouteProps extends RouteProps
	{
	}


	export const AnimatedSwitch: React.ComponentClass<AnimatedSwitchProps>;
	export const AnimatedRoute: React.ComponentClass<AnimatedRouteProps>;
	export const RouteTransition: React.ComponentClass<AnimatedSwitchProps>;
}

declare module "react-animated-burgers";