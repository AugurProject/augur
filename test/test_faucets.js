#!/usr/bin/env node

"use strict";

var assert = require("chai").assert;
var Augur = require("../augur");

Augur.connect();

var log = console.log;
var TIMEOUT = 120000;
var branch = Augur.branches.dev;
var coinbase = Augur.coinbase;
var init_cash_balance = Augur.getCashBalance(coinbase);
var init_rep_balance = Augur.getRepBalance(branch, coinbase);

describe("Faucets", function () {
    it("Reputation faucet", function (done) {
        this.timeout(TIMEOUT);
        Augur.reputationFaucet(
            branch,
            function (r) {
                // sent
                assert.equal(r.callReturn, "1");
                assert(parseInt(r.txHash) >= 0);
            },
            function (r) {
                // success
                assert.equal(r.callReturn, "1");
                assert(parseInt(r.blockHash) !== 0);
                assert(parseInt(r.blockNumber) >= 0);
                var rep_balance = Augur.getRepBalance(branch, coinbase);
                var cash_balance = Augur.getCashBalance(coinbase);
                assert.equal(rep_balance, "47");
                assert.equal(cash_balance, init_cash_balance);
                done();
            },
            function (r) {
                // failed
                throw r.message;
                done();
            }
        );
    });
    it("Cash faucet", function (done) {
        this.timeout(TIMEOUT);
        Augur.cashFaucet(
            function (r) {
                // sent
                assert.equal(r.callReturn, "1");
                assert(parseInt(r.txHash) >= 0);
            },
            function (r) {
                // success
                assert.equal(r.callReturn, "1");
                assert(parseInt(r.blockHash) !== 0);
                assert(parseInt(r.blockNumber) >= 0);
                var rep_balance = Augur.getRepBalance(branch, coinbase);
                var cash_balance = Augur.getCashBalance(coinbase);
                assert.equal(rep_balance, init_rep_balance);
                assert.equal(cash_balance, "10000");
                done();
            },
            function (r) {
                // failed
                throw r.message;
                done();
            }
        );
    });
});
