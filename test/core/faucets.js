#!/usr/bin/env node

"use strict";

var assert = require("chai").assert;
var constants = require("../../src/constants");
var numeric = require("../../src/numeric");
var utilities = require("../../src/utilities");
var Augur = utilities.setup(require("../../src"), process.argv.slice(2));
var log = console.log;

describe("Faucets", function () {
    it("Reputation faucet", function (done) {
        this.timeout(constants.TIMEOUT);
        var branch = Augur.branches.dev;
        var coinbase = Augur.coinbase;
        Augur.reputationFaucet(
            branch,
            function (r) {
                // sent
                assert.strictEqual(r.callReturn, "1");
                assert(numeric.bignum(r.txHash).toNumber());
            },
            function (r) {
                // success
                assert.strictEqual(r.callReturn, "1");
                assert(numeric.bignum(r.blockHash).toNumber() !== 0);
                assert(numeric.bignum(r.blockNumber).toNumber() >= 0);
                var rep_balance = Augur.getRepBalance(branch, coinbase);
                var cash_balance = Augur.getCashBalance(coinbase);
                assert.strictEqual(rep_balance, "47");
                done();
            },
            function (r) {
                // failed
                done(r);
            }
        );
    });
    it("Cash faucet", function (done) {
        this.timeout(constants.TIMEOUT);
        var branch = Augur.branches.dev;
        var coinbase = Augur.coinbase;
        var cash_balance = Augur.getCashBalance(coinbase);
        if (numeric.bignum(cash_balance).toNumber() >= 5) {
            done();
        } else {
            Augur.cashFaucet(
                function (r) {
                    // sent
                    assert(r.callReturn === "1" || r.callReturn === "-1");
                    assert(numeric.bignum(r.txHash).toNumber());
                },
                function (r) {
                    // success
                    assert(r.callReturn === "1" || r.callReturn === "-1");
                    assert(numeric.bignum(r.blockHash).toNumber() !== 0);
                    assert(numeric.bignum(r.blockNumber).toNumber() >= 0);
                    var rep_balance = Augur.getRepBalance(branch, coinbase);
                    var cash_balance = Augur.getCashBalance(coinbase);
                    if (r.callReturn === "1") {
                        assert.strictEqual(cash_balance, "10000");
                    } else {
                        assert(numeric.bignum(cash_balance).toNumber() > 5);
                    }
                    done();
                },
                function (r) {
                    // failed
                    done(r);
                }
            );
        }
    });
});
