import {Intercom} from "../Intercom/intercom";

export enum RespondSizes
{
	pico = 320,
	tiny = 600,
	small = 800,
	medium = 1000,
	large = 1200,
	huge = 1600,
	hd = 1920
}

type RespondSizesKeys = keyof typeof RespondSizes;

export interface RespondIntercomPayload
{
	sizes: RespondSizes[];
}

class RespondIntercom extends Intercom<RespondIntercomPayload>
{
	public static Instance = new RespondIntercom({
		sizes: []
	});

	constructor(initialState: RespondIntercomPayload)
	{
		super(initialState);

		this.addListeners();
	}

	private addListeners()
	{
		this.determineSize();
		window.addEventListener("resize", this.determineSize);
		window.addEventListener("load", this.determineSize);
	}

	public test(size: RespondSizes)
	{
		return this.state.sizes.indexOf(size) > -1;
	}

	private readonly determineSize = () =>
	{
		const sizeKeyStrings = Object.keys(RespondSizes).filter(a => isNaN(parseInt(a))) as RespondSizesKeys[];

		const current: RespondSizes[] = sizeKeyStrings.filter(key =>
		{
			const pxWidth = RespondSizes[key];
			const isMatch = matchMedia(`(max-width: ${pxWidth}px)`).matches;

			return isMatch;
		}).map(key => RespondSizes[key]);

		sizeKeyStrings
			.forEach(key =>
			{
				const className = `r-${key}`;
				const active = current.find(a => RespondSizes[key] === a);
				active
					? document.documentElement.classList.add(className)
					: document.documentElement.classList.remove(className);
			});

		this.update({
			sizes: current
		});
	}
}

export default RespondIntercom.Instance;