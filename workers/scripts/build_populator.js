const webpack = require("webpack");
const config = require("../webpack.config.populator");
const compiler = webpack(config);
compiler.run((err, stats) => {
   // console.log(err, stats);
});