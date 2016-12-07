const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config');
const express = require('express');
const helmet = require('helmet');

const app = express();
const compiler = webpack(config);

const PROD_HOST = 'app.augur.net';

// static handlers
app.use(express.static('build'));

// development specific
if (process.env.NODE_ENV === 'development') {
	// Hot Module Reload
	app.use(devMiddleware(compiler, {
		publicPath: config.output.publicPath,
		stats: {
			color: true
		}
	}));

	app.use(hotMiddleware(compiler));
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
