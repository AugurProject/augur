#!/usr/bin/env node

"use strict";

var assert = require("chai").assert;
var utils = require("../../src/utilities");
var Augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = Augur.constants;
var numeric = Augur.numeric;
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

        function faucet() {
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
                    var rep_balance = Augur.getRepBalance(Augur.branches.dev, Augur.coinbase);
                    var cash_balance = Augur.getCashBalance(Augur.coinbase);
                    if (r.callReturn === "1") {
                        assert.strictEqual(cash_balance, "10000");
                    } else {
                        assert.isAbove(numeric.bignum(cash_balance).toNumber(), 5);
                    }
                    done();
                },
                function (r) {
                    // failed
                    done(r);
                }
            );
        }

        var cash_balance = Augur.getCashBalance(Augur.coinbase);

        if (numeric.bignum(cash_balance).toNumber() >= 5) {
            var start_balance = numeric.bignum(cash_balance);
            Augur.sendCash({
                to: receiver,
                value: start_balance - 1,
                onSent: function (r) {
                    // log(r);
                },
                onSuccess: function (r) {
                    var final_balance = numeric.bignum(Augur.getCashBalance(Augur.coinbase));
                    assert.strictEqual(start_balance.sub(final_balance).toNumber(), start_balance - 1);
                    faucet();
                },
                onFailed: function (r) {
                    throw r;
                }
            });

        } else {
            faucet();
        }
    });

});
