const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: [
		'react-hot-loader/patch',
		'webpack-hot-middleware/client',
		'./src/main'
	],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json', '.less'],
		alias: {
			modules: path.resolve(__dirname, 'src/modules'),
			utils: path.resolve(__dirname, 'src/utils')
		}
	},
	module: {
		loaders: [
			{
				test: /\.json/,
				loader: 'json-loader'
			},
			{
				test: /\.less/,
				loader: 'less-loader'
			},
			{
				test: /\.jsx?$/,
				loader: 'babel-loader'
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
	],
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		child_process: 'empty'
	},
};


// resolve: {
// 	extensions: ['.js', '.jsx', '.less', '.json'],
//
// },
