export interface IFullVideoSearchQueryParams
{
	query: string;
	limit: number;
	page: number;
	feedPreference?: string;
	languagePreference: "EN";
	searchType: "UNIFIED";
	contentPreference: "CMS_FIRST"
}