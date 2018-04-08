const path = require('path');
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './wwwroot/dist';
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env) {
    const isDevBuild = !(env && env.prod);
    return [{
        mode: isDevBuild ? "development" : "production",
        entry: {
            main: './ClientApp/boot.tsx'
        },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: "[name].bundle.js",
            publicPath: 'dist/'
        },
        devtool: isDevBuild ? 'source-map' : "eval",
        resolve: {
            extensions: ['.js', '.json', '.ts', '.tsx'],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'source-map-loader'
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(css|scss)/,
                    use: [{
                        loader: "style-loader"
                    }, {
                        loader: "css-loader", options: {
                            sourceMap: true
                        }
                    }, {
                        loader: "sass-loader", options: {
                            sourceMap: true
                        }
                    }]
                },
            ]
        },
        optimization: {
            splitChunks: {
                chunks: "all"
            }
        },
        plugins: [
            new CheckerPlugin(),
            new HtmlWebpackPlugin({
                inject: false,
                template: 'Views/Shared/_Layout.cshtml',
                filename: '../../Views/Shared/_Layout_G.cshtml'
            }),
            /* new webpack.DllReferencePlugin({
                 context: __dirname,
                 manifest: require('./wwwroot/dist/vendor-manifest.json')
             })*/
        ]
    }];
};