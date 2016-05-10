#!/usr/bin/env node
/**
 * augur-client static file server
 */

"use strict";

var nodeStatic = require("node-static");
var fs = require("fs");
var path = require('path');
var http = require("http");
var https = require("https");
var chalk = require("chalk");
var getopt = require("posix-getopt");

var ssl = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
};
var homedir = "./build";
var file = new(nodeStatic.Server)(homedir, {cache: 600});
var htmlFile = 'index.html';

var files = fs.readdirSync(homedir);
for(var p in files) {
   if(path.extname(files[p]) === ".html") {
       htmlFile = files[p];
   }
}

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
    var re = /\/(styles\.css|splash\.css|images|fonts|build\.js|augur\.min\.js)/;

    // route to app if not static URI
    if (!req.url.match(re)) req.url = "/" + htmlFile;

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
