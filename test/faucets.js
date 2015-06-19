#!/usr/bin/env node

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var Augur = require("../augur");

Augur.connect();

var log = console.log;
var branch = Augur.branches.dev;
var coinbase = Augur.coinbase;

log("Faucets:");

setTimeout(function () {
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
            throw r.message;
        }
    );
}, 0);

setTimeout(function () {
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
            throw r.message;
        }
    );
}, 0);
