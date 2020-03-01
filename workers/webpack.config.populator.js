const path = require('path');
const fs = require('fs');
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const entryPath = resolveApp("workers/PopulatorServer.ts");

module.exports = {
    entry: entryPath,
    target: "node",
    mode: "production",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        minimize: false
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin(),
    ],
    output: {
        filename: 'populator.js',
        path: path.resolve(appDirectory, "output/populator")
    }
};