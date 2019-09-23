const buildSwagger = require("./swagger");
const finalize = require("./finalize");
const webpack = require("webpack");
const config = require("../webpack.config");

const compiler = webpack(config);
compiler.run((err, stats) => {
    if (stats) {
        console.log(stats);
    }
    buildSwagger.buildSwagger();
    finalize.finalize();
});