#!/usr/bin/env node

"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("chai").assert;
var chalk = require("chalk");
var Augur = require("../augur");

var args = process.argv.slice(2);
if (args.length && args[0] === "--gospel") {
    var gospel = path.join(__dirname, "gospel.json");
    Augur.contracts = JSON.parse(fs.readFileSync(gospel));
}
Augur.connect();

var log = console.log;
var branch = Augur.branches.dev;
var coinbase = Augur.coinbase;

log("Faucets:");

Augur.reputationFaucet(
    branch,
    function (r) {
        // sent
    },
    function (r) {
        // success
        log(chalk.green("  ✓ ") + chalk.gray("Reputation faucet"));
    },
    function (r) {
        // failed
        if (r.message) {
            throw r.message;
        } else {
            throw r;
        }
    }
);

Augur.cashFaucet(
    function (r) {
        // sent
    },
    function (r) {
        // success
        log(chalk.green("  ✓ ") + chalk.gray("Cash faucet"));
    },
    function (r) {
        // failed
        if (r.message) {
            throw r.message;
        } else {
            throw r;
        }
    }
);
