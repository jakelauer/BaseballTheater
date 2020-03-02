const buildSwagger = require("./swagger");
const finalize = require("./finalize");
const webpack = require("webpack");
const configFactory = require("../webpack.config");

const serverEnv = process.argv.find(a => a.includes("serverenv")).split("=")[1];

const compiler = webpack(configFactory(serverEnv));
compiler.run((err, stats) => {
    finalize.finalize();

    buildSwagger.buildSwagger();
});