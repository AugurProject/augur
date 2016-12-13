/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
/* eslint-disable import/no-extraneous-dependencies */

const express = require('express');
const helmet = require('helmet');

const config = require('./webpack.config');

const app = express();
const compiler = webpack(config);

const PROD_HOST = 'app.augur.net';

if (process.env.NODE_ENV === 'development') {
	// Hot Module Reload
	app.use(devMiddleware(compiler, {
		publicPath: config.output.publicPath
	}));

	app.use(hotMiddleware(compiler));
} else {
	// Static Path
	app.use(express.static('build'));
}

app.use(helmet());
app.use(require('prerender-node').set('prerenderToken', process.env.RENDERTOKEN));

// redirect production site to secure version
app.get('*', (req, res, next) => {
	// res.sendFile(path.resolve(__dirname, 'build/index.html'));
	if (req.headers['x-forwarded-proto'] !== 'https' && req.get('host') === PROD_HOST) {
		res.redirect('https://' + PROD_HOST + req.url);
	} else {
		next();   // continue to other routes if we're not redirecting
	}
});

app.get('/', (req, res) => {
	console.log('loaded');
});

app.listen(process.env.PORT || 8080);
