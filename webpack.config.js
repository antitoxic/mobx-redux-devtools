const webpack = require('webpack');
const path = require('path');
const PWD = __dirname;
const config = {};

/**************** RESOLVING NAMES ***************/
config.resolve = {
    root: [path.resolve(`${PWD}/src/`)],
    extensions: ['', '.js']
};

/**************** INPUT ***************/
config.entry = './src/index';

/**************** OUTPUT ***************/
config.output = {
    path: path.resolve(`${PWD}/dist`),
    libraryTarget: 'umd',
    library: 'mobxReduxDevtools',
    filename: 'index.js'
};
config.externals = {
    "react": true,
    "react-dom": true,
    "redux": true,
    "redux-devtools": true,
    "mobx": true,
    "mobx-react": true
};

/**************** PLUGINS ***************/
config.plugins = [
    new webpack.ProvidePlugin({ 'React': 'react' }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        compress: {
            warnings: false,
            drop_console: true
        }
    })
];

/**************** MODULE LOADING ***************/
config.module = {
    loaders: [
        {
            test: /\.jsx?$/,
            loader: 'babel',
            query: {
                cacheDirectory: true,
                plugins: [
                    'transform-object-assign',
                    'transform-class-properties',
                    'transform-object-rest-spread'
                ],
                presets: ['es2015', 'react']
            }
        }
    ]
};

module.exports = config;
