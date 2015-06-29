#!/usr/bin/env node

"use strict";

var fs = require("fs");
var path = require("path");
var Augur = require("../augur");

var args = process.argv.slice(2);
if (args.length && args[0] === "--gospel") {
    var gospel = path.join(__dirname, "gospel.json");
    Augur.contracts = JSON.parse(fs.readFileSync(gospel));
}
Augur.connect();

var log = console.log;

Augur.dispatch({
    branchId: Augur.branches.dev,
    onSent: function (r) {
        log("dispatch sent:", r.callReturn);
    },
    onSuccess: function (r) {
        log("dispatch success:", r);
    },
    onFailed: function (r) {
        throw r.message;
    }
});
