const fs = require("fs");
const path = require("path");
const {
	loadSchema,
	UrlLoader
} = require('graphql-tools')
const {
	printSchema
} = require("graphql");

const generateSchema = async () => {
	const remoteSchema = await loadSchema(`https://fastball-gateway.mlb.com/graphql`, {
		loaders: [
			new UrlLoader()
		]
	});

	fs.writeFileSync(path.join(__dirname, "../src/Global/GQL/schema.generated.gql"), printSchema(remoteSchema));
};

generateSchema();