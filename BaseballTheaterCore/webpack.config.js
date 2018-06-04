const path = require('path');
const webpack = require('webpack');
const bundleOutputDir = './wwwroot/dist';
var HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

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
        devtool: "cheap-module-source-map",
        resolve: {
            extensions: ['.js', '.json', '.ts', '.tsx'],
            plugins: [
                new TsconfigPathsPlugin()
            ]
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'source-map-loader'
                },
                {
                    test: /\.(tsx|ts)?$/,
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
	            {
		            test: /\.(less)/,
		            use: [{
			            loader: "style-loader"
		            }, {
			            loader: "css-loader", options: {
				            sourceMap: true
			            }
		            }, {
			            loader: "less-loader", options: {
				            sourceMap: true,
				            javascriptEnabled: true // required for the Ant less files
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
            new HtmlWebpackPlugin({
                inject: false,
                template: 'Views/Shared/_Layout.cshtml',
                filename: '../../Views/Shared/_Layout_G.cshtml'
            })
        ]
    }];
};