#!/usr/bin/env node

"use strict";

var fs = require("fs");
var assert = require("chai").assert;
var chalk = require("chalk");
var Augur = require("../augur");

Augur.contracts = JSON.parse(fs.readFileSync("gospel.json"));
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
