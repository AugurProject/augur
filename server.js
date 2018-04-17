const express = require('express');
const helmet = require('helmet');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = express();

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.config');
  const compiler = webpack(config);

  // Hot Module Reload
  app.use(devMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(hotMiddleware(compiler));
} else {
  // Static Path
  app.use(express.static('build'));
}

app.listen = function () {
  let server = null;

  if (process.env.USE_SSL === 'true') {
    const key = fs.readFileSync('augur-local.key');
    const cert = fs.readFileSync('augur-local.crt');

    server = https.createServer(
      {
        key,
        cert
      },
      this
    )
  } else {
    server = http.createServer(this)
  }

  return server.listen.apply(server, arguments);
}

app.listen(process.env.PORT || 8080);
