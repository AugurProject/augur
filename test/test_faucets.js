#!/usr/bin/env node

"use strict";

var assert = require("chai").assert;
var constants = require("./constants");
var utilities = require("./utilities");
var Augur = utilities.setup(require("../augur"), process.argv.slice(2));
var log = console.log;

var branch = Augur.branches.dev;
var coinbase = Augur.coinbase;

describe("Faucets", function () {
    it("Reputation faucet", function (done) {
        this.timeout(constants.timeout);
        Augur.reputationFaucet(
            branch,
            function (r) {
                // sent
                assert.equal(r.callReturn, "1");
                assert(Augur.abi.bignum(r.txHash).toNumber() >= 0);
            },
            function (r) {
                // success
                assert.equal(r.callReturn, "1");
                assert(Augur.abi.bignum(r.blockHash).toNumber() !== 0);
                assert(Augur.abi.bignum(r.blockNumber).toNumber() >= 0);
                var rep_balance = Augur.getRepBalance(branch, coinbase);
                var cash_balance = Augur.getCashBalance(coinbase);
                assert.equal(rep_balance, "47");
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
        this.timeout(constants.timeout);
        var cash_balance = Augur.getCashBalance(coinbase);
        if (Augur.abi.bignum(cash_balance).toNumber() > 0) {
            done();
        }
        Augur.cashFaucet(
            function (r) {
                // sent
                assert(r.callReturn === "1" || r.callReturn === "-1");
                assert(Augur.abi.bignum(r.txHash).toNumber() >= 0);
            },
            function (r) {
                // success
                assert(r.callReturn === "1" || r.callReturn === "-1");
                assert(Augur.abi.bignum(r.blockHash).toNumber() !== 0);
                assert(Augur.abi.bignum(r.blockNumber).toNumber() >= 0);
                var rep_balance = Augur.getRepBalance(branch, coinbase);
                var cash_balance = Augur.getCashBalance(coinbase);
                if (r.callReturn === "1") {
                    assert.equal(cash_balance, "10000");
                } else {
                    assert(Augur.abi.bignum(cash_balance).toNumber() > 5);
                }
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
