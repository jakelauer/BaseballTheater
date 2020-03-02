const webpack = require("webpack");
const path = require('path');
const fs = require('fs');
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const entryPath = resolveApp("server/server.ts");

module.exports = (serverEnv) => ({
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
    output: {
        filename: 'server.js',
        path: path.resolve(appDirectory, "output/server")
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin(),
        new webpack.DefinePlugin({
            __SERVER_ENV__: `\"${serverEnv}\"`
        })
    ]
});