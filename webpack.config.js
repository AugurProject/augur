"use strict";

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PATHS = {
	BUILD: path.resolve(__dirname, 'build'),
	APP: path.resolve(__dirname, 'src')
};

// COMMON CONFIG
let config = {
	entry: {
		'assets/styles/styles': `${PATHS.APP}/styles`,
		'assets/scripts/vendor': [
			'react',
			'react-dom',
			'redux',
			'redux-thunk',
			'moment',
			'react-datetime'
		]
	},
	output: {
		filename: '[name].[chunkhash].js',
		path: PATHS.BUILD,
		publicPath: '/'
	},
	resolve: {
		extensions: ['.html', '.less', '.js', '.jsx', '.json'],
		alias: {
			modules: path.resolve(PATHS.APP, 'modules'),
			utils: path.resolve(PATHS.APP, 'utils')
		}
	},
	module: {
		loaders: [
			{
				test: /\.html/,
				loader: 'html-loader',
				query: {
					minimize: true
				}
			},
			{
				test: /\.woff/,
				loader: 'file-loader'
			},
			{
				test: /\.jsx?/,
				loader: 'babel-loader'
			},
			{
				test: /\.json/,
				loader: 'json-loader'
			}
		]
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(true),
		new CopyWebpackPlugin([
			{
				from: path.resolve(PATHS.APP, 'splash.css'),
				to: path.resolve(PATHS.BUILD, 'assets/styles')
			},
			{
				from: path.resolve(PATHS.APP, 'env.json'),
				to: path.resolve(PATHS.BUILD, 'config')
			},
			{
				from: path.resolve(PATHS.APP, 'manifest.json'),
				to: path.resolve(PATHS.BUILD, 'config')
			},
			{
				from: path.resolve(PATHS.APP, 'favicon.ico'),
				to: PATHS.BUILD
			},
			{
				from: path.resolve(PATHS.APP, 'assets/fonts'),
				to: path.resolve(PATHS.BUILD, 'assets/fonts')
			},
			{
				from: path.resolve(PATHS.APP, 'assets/images'),
				to: path.resolve(PATHS.BUILD, 'assets/images')
			},
			{
				from: path.resolve(__dirname, 'node_modules/airbitz-core-js-ui/assets'),
				to: path.resolve(PATHS.BUILD, 'abcui/assets')
			},
			{
				from: path.resolve(PATHS.APP, 'sitemap.xml'),
				to: PATHS.BUILD
			}
		]),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			filename: 'assets/scripts/common.js'
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(PATHS.APP, 'index.html'),
			chunksSortMode: (a, b) => {
				const order = ['common', 'assets/scripts/vendor', 'assets/styles/styles', 'main'];

				return order.indexOf(b.names[0]) + order.indexOf(a.names[0]);
			}
		}),
		new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
				GETH_PASSWORD: JSON.stringify(process.env.GETH_PASSWORD)
      }
		}),
	],
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty'
	},
};

// DEVELOPMENT SPECIFIC CONFIG
if (process.env.NODE_ENV === 'development') {
	config = merge(config, {
		entry: {
			main: [
				'react-hot-loader/patch',
				'webpack-hot-middleware/client',
				`${PATHS.APP}/main`
			]
		},
		module: {
			loaders: [
				{
					test: /\.less/,
					loaders: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader', 'import-glob-loader']
				}
			]
		},
		devtool: 'eval-source-map',
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NoErrorsPlugin(),
		]
	});
// PRODUCTION SPECIFIC CONFIG
} else {
	config = merge(config, {
		entry: {
			main: `${PATHS.APP}/main`
		},
		module: {
			loaders: [
				{
					test: /\.less/,
					loaders: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!postcss-loader!less-loader!import-glob-loader' }),
				}
			]
		},
		devtool: 'source-map',
		plugins: [
			new ExtractTextPlugin('[name].css'),
			new webpack.optimize.UglifyJsPlugin({
				comments: false,
				dropConsole: true
			})
		]
	});
}

const WEBPACK_CONFIG = config;

module.exports = WEBPACK_CONFIG;
