var webpack = require('webpack');
var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
    devServer: {
        hot: true,
        port: 8089,
        host: '0.0.0.0',
        inline: true,
        progress: true,
        contentBase: './build',
        historyApiFallback: true,
        proxy: {
            '/locale*': {
                changeOrigin: true,
                target: 'https://192.168.124.207:8089/',
                secure: false
            },
            '/cgi?*': {
                changeOrigin: true,
                target: 'https://192.168.124.207:8089/',
                secure: false
            }
        }
    },
    devtool: "cheap-module-eval-source-map",
    entry: [
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://0.0.0.0:8089',
        path.resolve(__dirname, 'app/_window.js'),
        path.resolve(__dirname, 'app/main.jsx')
    ],
    output: {
        path: __dirname + '/build',
        publicPath: '/',
        filename: './bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            { test: /\.css$/, include: path.resolve(__dirname, 'app'), loader: 'style-loader!css-loader!postcss-loader' },
            { test: /\.less$/, loader: "style!css!less?outputStyle=expanded" },
            { test: /\.js[x]?$/, include: path.resolve(__dirname, 'app'), exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' },
            { test: /\.json$/, loader: 'json' }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.less', '.json'],
    },
    postcss: function () {
        return [require('autoprefixer'), require('precss')];
    },
    eslint: {
        configFile: './.eslintrc.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        //new OpenBrowserPlugin({ url: 'http://0.0.0.0:8089' }),
        commonsPlugin
    ]
};
