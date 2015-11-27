#!/usr/bin/env node
/**
 * augur client backend
 */

"use strict";

var nodeStatic = require('node-static'),
    fs = require('fs'),
    https = require('https'),
    util = require('util');

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

var webroot = './app',
    port = process.env.PORT || 8080;

var file = new(nodeStatic.Server)(webroot, { cache: 600 });

https.createServer(options, function (req, res) {

    // static URIs
    var re = /\/(css|images|fonts|app\.js)/;

    // route to app if not static URI
    if (!req.url.match(re)) req.url = '/augur.html';

    file.serve(req, res, function (err, result) {
        if (err) {
            console.error('Error serving %s - %s', req.url, err.message);
            res.writeHead(err.status, err.headers);
            res.end();
        } else {
            console.log('%s', req.url);
        }
    });

}).listen(port);

console.log('node-static running at https://localhost:%d', port);
