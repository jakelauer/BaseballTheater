const webpack = require("webpack");
const path = require("path");
const configFactory = require("../webpack.config.populator");
const fs = require('fs-extra');

const appDirectory = fs.realpathSync(process.cwd());
const resolve = relativePath => path.resolve(appDirectory, relativePath);

module.exports = (outputDir, callback) => {
    const compiler = webpack(configFactory(outputDir));

    compiler.run((err, stats) => {
        callback();
    });
}
