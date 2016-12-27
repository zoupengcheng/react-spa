var webpack = require('webpack');
var path = require('path');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
    // devtool: 'eval',
    entry: [
        path.resolve(__dirname, 'app/_window.js'),
        path.resolve(__dirname, 'app/main.jsx')
    ],
    output: {
        path: __dirname + '/build',
        publicPath: '/',
        filename: './bundle.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, include: path.resolve(__dirname, 'app'), loader: 'style-loader!css-loader!postcss-loader' },
            { test: /\.less$/, loader: "style!css!less?outputStyle=expanded" },
            { test: /\.js[x]?$/, include: path.resolve(__dirname, 'app'), exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' },
            { test: /\.json$/, loader: 'json' }
        ]
    },    
    postcss: function () {
        return [require('autoprefixer'), require('precss')];
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.less', '.json'],
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new CopyWebpackPlugin([
            { from: './app/index.html', to: 'index.html' },
            { from: './app/images', to: 'images' }
        ]),
        // new OpenBrowserPlugin({ url: 'http://localhost:8002' }),
        commonsPlugin
    ]
};
