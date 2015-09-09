#!/usr/bin/env node
/**
 * augur client backend
 */

"use strict";

var express = require("express");
var NeDB = require("nedb");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var log = console.log;

var webroot = __dirname + "/app";
var port = process.env.PORT || 8080;
var local = new NeDB({ filename: "augur.db", autoload: true });

app.use(express.static(webroot));

app.get("/", function (req, res) {
    res.sendFile(webroot + "/augur.html");
});

io.on("connection", function (socket) {

});

http.listen(port, function () {
    log("http://localhost:" + port.toString());
});
