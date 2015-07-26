#!/usr/bin/env node

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var Augur = require("../src");
var numeric = require("../src/numeric");
var log = console.log;

Augur = require("../src/utilities").setup(Augur, process.argv.slice(2));

log("Faucets:");

Augur.reputationFaucet(
    Augur.branches.dev,
    function (r) {
        // sent
    },
    function (r) {
        // success
        log(chalk.green("  ✓ ") + chalk.gray("Reputation faucet"));
    },
    function (r) {
        // failed
        r.name = r.error;
        throw r;
    }
);

if (Number(Augur.getCashBalance(Augur.coinbase)) < 5) {
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
            r.name = r.error;
            throw r;
        }
    );
}
