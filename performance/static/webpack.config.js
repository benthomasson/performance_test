var webpack = require("webpack");
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
    entry: {
        app: "./src/index.js",
        vendor: ["angular",
                 "angular-ui-router"]
    },
    output: {
        path: __dirname + "/js",
        filename: "bundle.js"
    },
    plugins: [
         new HardSourceWebpackPlugin(),
         new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' })
    ]
};
