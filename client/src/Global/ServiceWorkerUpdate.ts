export class ServiceWorkerUpdate
{
	public static checkForUpdates = (cb: (hasUpdate: boolean) => void) =>
	{
		if ('serviceWorker' in navigator)
		{
			const testForUpdate = (registration: ServiceWorkerRegistration) =>
			{
				if (registration?.waiting && registration?.active)
				{
					cb(true);
				}
			};

			navigator.serviceWorker.getRegistration().then(testForUpdate);

			window.addEventListener('load', async () =>
			{
				const registration = await navigator.serviceWorker.register('/service-worker.js');
				testForUpdate(registration);
			});
		}
	};

	public static update = () =>
	{
		navigator.serviceWorker.getRegistration().then(registration =>
		{
			if (!registration)
			{
				location.reload();
				return;
			}

			if (!registration.waiting)
			{
				if (registration.installing)
				{
					registration.installing.onstatechange = () =>
					{
						if (registration.installing.state === "installed")
						{
							registration.installing.postMessage({
								type: "SKIP_WAITING"
							});
						}
					};
				}
				else
				{
					location.reload();
				}
				return;
			}

			setTimeout(() => location.reload(), 1500);

			registration.waiting.postMessage({
				type: "SKIP_WAITING"
			});
		}).catch(e => location.reload());
	}
}