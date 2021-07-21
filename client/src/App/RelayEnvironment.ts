import {Environment, Network, RecordSource, Store} from "relay-runtime";
import {RequestParameters} from "relay-runtime/lib/util/RelayConcreteNode";
import {Variables} from "relay-runtime/lib/util/RelayRuntimeTypes";

const graphQlFetcher = async (
	query: string,
	variables: any) =>
{
	// Fetch data from GitHub's GraphQL API:
	const response = await fetch(`https://fastball-gateway.mlb.com/graphql`, {
		method: 'POST',
		body: JSON.stringify({
			query,
			variables,
		}),
	});

	// Get the response as JSON
	return await response.json();
}

const fetchRelay = (params: RequestParameters, variables: Variables) =>
{
	console.log(`fetching query ${params.name} with ${JSON.stringify(variables)}`);
	return graphQlFetcher(params.text, variables);
}

export default new Environment({
	network: Network.create(fetchRelay),
	store: new Store(new RecordSource())
});