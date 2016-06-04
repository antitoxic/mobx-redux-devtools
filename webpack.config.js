const webpack = require('webpack');
const path = require('path');
const PWD = __dirname;
const config = {};

/**************** RESOLVING NAMES ***************/
config.resolve = {
    root: [
        path.resolve(`./src/`)
    ],
    extensions: ['', '.js']
};

/**************** INPUT ***************/
config.entry = './src/index';

/**************** OUTPUT ***************/
config.output = {
    path: path.normalize(`${PWD}/build`),
    libraryTarget: 'umd',
    library: 'movxReduxDevtools',
    path: '__dirname',
    filename: 'index.js',
};

/**************** PLUGINS ***************/
config.plugins = [
    new webpack.ProvidePlugin({ 'React': 'react' }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        //mangle: ... this actually increases build size
        compress: {
            warnings: false,
            drop_console: true
        }
    })
]
config.module = {
    loaders: [
        { test: /\.css$/, loader: getStylingLoader() },
        {
            test: /\.jsx?$/,
            loader: 'babel',
            query: {
                cacheDirectory: true,
                plugins: [
                    'jsx-control-statements',
                    'transform-decorators-legacy',
                    'transform-class-properties',
                    'transform-object-assign',
                    'transform-object-rest-spread'
                ],
                presets: ['es2015', 'react']
            }
        }
    ]
};

/**************** File changes watching/monitoring options ***************/
config.watchOptions = {
    aggregateTimeout: 100
};

module.exports = config;
