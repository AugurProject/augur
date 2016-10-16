const express = require('express');
const helmet = require('helmet');
const PROD_HOST = 'app.augur.net';
const app = express();

app.use(helmet());
app.use(require('prerender-node').set('prerenderToken', process.env.RENDERTOKEN));

// static handlers
app.use(express.static('build'));

// redirect production site to secure version
app.get('*', (req, res, next) => {
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
