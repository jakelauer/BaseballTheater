const buildSwagger = require("./swagger");
const finalize = require("./finalize");
const webpack = require("webpack");
const config = require("../webpack.config");

const compiler = webpack(config);
compiler.run((err, stats) => {
    if (err) {
        console.log(err);
    }
    finalize.finalize();

    buildSwagger.buildSwagger();
});