#!/usr/bin/env node

"use strict";

var BigNumber = require("bignumber.js");
var assert = require("chai").assert;
var chalk = require("chalk");
var numeric = require("../src/numeric");
var utils = require("../src/utilities");
var Augur = utils.setup(require("../src"), process.argv.slice(2));
var log = console.log;

var branch = Augur.branches.dev;
var coinbase = Augur.coinbase;
var balance = {
    reputation: numeric.bignum(Augur.getRepBalance(branch, coinbase)),
    cash: numeric.bignum(Augur.getCashBalance(coinbase))
};
var needs = {
    reputation: !balance.reputation || balance.reputation.lt(new BigNumber(47)),
    cash: !balance.cash || balance.cash.lt(new BigNumber(5))
};

// log("Cash:      ", chalk.green(balance.cash));
// log("Reputation:", chalk.green(balance.reputation));

if (needs.reputation || needs.cash) {

    log("Faucets:");

    if (needs.reputation) {
        Augur.reputationFaucet(
            branch,
            function (r) {
                // sent
            },
            function (r) {
                // success
                assert(r.txHash);
                assert.equal(r.callReturn, "1");
                log(chalk.green("  ✓ ") + chalk.gray("Reputation faucet"));
            },
            function (r) {
                // failed
                throw r;
            }
        );
    }

    if (needs.cash) {
        Augur.cashFaucet(
            function (r) {
                // sent
            },
            function (r) {
                // success
                assert(r.txHash);
                assert.equal(r.callReturn, "1");
                log(chalk.green("  ✓ ") + chalk.gray("Cash faucet"));
            },
            function (r) {
                // failed
                throw r;
            }
        );
    }

}
