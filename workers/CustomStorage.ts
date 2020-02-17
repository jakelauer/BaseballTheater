const LocalStorage = require('node-localstorage').LocalStorage as StorageProxy;

interface StorageProxy extends Storage
{
	new(path: string): Storage;
}

export class CustomStorage
{
	public static Instance = new CustomStorage();

	public Store: Storage;

	constructor()
	{
		this.Store = new LocalStorage('./posted');
	}
}