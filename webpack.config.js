const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		main: [
			'react-hot-loader/patch',
			'webpack-hot-middleware/client',
			'./src/main'
		],
		vendor: [
			'react',
			'react-dom',
			'redux',
			'redux-thunk'
		]
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].js',
		publicPath: '/'
	},
	resolve: {
		extensions: ['.pug', '.less', '.js', '.jsx', '.json'],
		alias: {
			modules: path.resolve(__dirname, 'src/modules'),
			utils: path.resolve(__dirname, 'src/utils')
		}
	},
	module: {
		loaders: [
			{
				test: /\.pug/,
				loader: 'pug-loader'
			},
			{
				test: /\.less/,
				loaders: ['style-loader', 'css-loader', 'less-loader']
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
	stats: {
		color: true
	},
	devtool: 'cheap-module-source-map',
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor'
		}),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, 'src/env.json'),
				to: path.resolve(__dirname, 'build')
			},
			{
				from: path.resolve(__dirname, 'src/manifest.json'),
				to: path.resolve(__dirname, 'build')
			},
			{
				from: path.resolve(__dirname, 'src/assets/fonts'),
				to: path.resolve(__dirname, 'build/assets/fonts')
			},
			{
				from: path.resolve(__dirname, 'src/assets/images'),
				to: path.resolve(__dirname, 'build/assets/images')
			}
		]),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.pug')
		})
	],
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty'
	},
};
