#!/usr/bin/env node

"use strict";

var assert = require("chai").assert;
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;
var numeric = augur.numeric;
var log = console.log;

describe("Faucets", function () {

    it("Reputation faucet", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.reputationFaucet(
            augur.branches.dev,
            function (r) {
                // sent
                assert.strictEqual(r.callReturn, "1");
                assert(numeric.bignum(r.txHash).toNumber());
            },
            function (r) {
                // success
                assert.strictEqual(r.callReturn, "1");
                assert.notStrictEqual(numeric.bignum(r.blockHash).toNumber(), 0);
                assert(numeric.bignum(r.blockNumber).toNumber() >= 0);
                var rep_balance = augur.getRepBalance(augur.branches.dev, augur.coinbase);
                var cash_balance = augur.getCashBalance(augur.coinbase);
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

        this.timeout(constants.TIMEOUT*2);

        function faucet() {
            augur.cashFaucet(
                function (r) {
                    // sent
                    assert(r.callReturn === "1" || r.callReturn === "-1");
                    assert(numeric.bignum(r.txHash).toNumber());
                },
                function (r) {
                    // success
                    assert(r.callReturn === "1" || r.callReturn === "-1");
                    assert.notStrictEqual(numeric.bignum(r.blockHash).toNumber(), 0);
                    var rep_balance = augur.getRepBalance(augur.branches.dev, augur.coinbase);
                    var cash_balance = augur.getCashBalance(augur.coinbase);
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

        var cash_balance = augur.getCashBalance(augur.coinbase);

        if (Number(cash_balance) >= 5) {
            var start_balance = numeric.bignum(cash_balance);
            augur.sendCash({
                to: utils.get_test_accounts(
                    augur,
                    constants.MAX_TEST_ACCOUNTS
                )[1],
                value: start_balance.sub(new BigNumber(1)),
                onSent: function (r) {
                    // log(r);
                },
                onSuccess: function (r) {
                    var final_balance = numeric.bignum(
                        augur.getCashBalance(augur.coinbase)
                    );
                    assert.strictEqual(final_balance.toFixed(), "1");
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
