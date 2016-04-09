#!/usr/bin/env node
/**
 * augur-client static file server
 */

"use strict";

var nodeStatic = require("node-static");
var fs = require("fs");
var http = require("http");
var https = require("https");
var util = require("util");
var chalk = require("chalk");
var getopt = require("posix-getopt");

var ssl = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
};
var file = new(nodeStatic.Server)("./target", {cache: 600});

function log(str) {
    console.log(chalk.cyan.dim("[augur]"), str);
}

function serveHTTP(req, res) {

    // redirect */blog/* urls to the augur.org/blog archive
    if (req.url.match(/\/blog\//)) {
        res.writeHead(302, {"Location": "http://www.augur.org" + req.url});
        return res.end();
    }

    // static URIs
    var re = /\/(css|images|fonts|app\.js|libs\/ipfsapi\.min\.js)/;

    // route to app if not static URI
    if (!req.url.match(re)) req.url = "/index.html";

    file.serve(req, res, function (err, result) {
        if (err) {
            console.error("Error serving %s: %s", req.url, err.message);
            res.writeHead(err.status, err.headers);
            res.end();
        } else {
            log(req.url);
        }
    });
}

function runserver(protocol, port) {
    if (protocol === "https") {
        https.createServer(ssl, serveHTTP).listen(port);        
    } else {
        http.createServer(serveHTTP).listen(port);
    }
    log(protocol + "://localhost:" + port.toString());
}

(function init(args) {
    var opt, port, protocol, parser;
    parser = new getopt.BasicParser("s(ssl)p:(port)", args);
    while ( (opt = parser.getopt()) !== undefined) {
        switch (opt.option) {
        case 's':
            protocol = "https";
            break;
        case 'p':
            port = opt.optarg;
            break;
        }
    }
    runserver(protocol || "http", port || process.env.PORT || 8080);
})(process.argv);
