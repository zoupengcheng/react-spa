var webpack = require('webpack');
var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
// var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const vendors = [
    'antd',
    'echarts',
    'echarts/lib/chart/pie',
    'echarts/lib/component/tooltip',
    'echarts/lib/component/title',
    'echarts/lib//component/legend',
    'echarts/lib/chart/line',
    'echarts/lib//component/grid',
    'react',
    'react-cookie',
    'react-dom',
    'react-router',
    'react-intl',
    'react-redux',
    'redux',
    'redux-thunk',
    'underscore'
];

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
                target: 'http://192.168.124.116:8089',
                secure: false
            },
            '/cgi?*': {
                changeOrigin: true,
                target: 'http://192.168.124.116:8089',
                secure: false
            },
            '/*.json': {
                changeOrigin: true,
                target: 'http://192.168.124.116:8089',
                secure: false
            }
        }
    },
    devtool: "cheap-module-eval-source-map",
    entry: {
        'main': [
            'webpack/hot/dev-server',
            'webpack-dev-server/client?http://0.0.0.0:8089',
            path.resolve(__dirname, 'app/_window.js'),
            path.resolve(__dirname, 'app/main.jsx')
        ],
        vendor: vendors
    },
    output: {
        path: __dirname + '/build',
        publicPath: '/',
        filename: './[name].js'
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
            { test: /\.css$/, include: path.resolve(__dirname, 'app'), loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            { test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader") },
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
        // commonsPlugin
        new CommonsChunkPlugin({
            name: ["common", "vendor"],
            minChunks: 2
        }),
        new ExtractTextPlugin("main.css")
    ]
};
