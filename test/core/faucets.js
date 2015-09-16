#!/usr/bin/env node

"use strict";

var BigNumber = require("bignumber.js");
var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;
var log = console.log;

describe("Faucets", function () {

    it("reputationFaucet", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.reputationFaucet(
            augur.branches.dev,
            function (r) {
                // sent
                assert.strictEqual(r.callReturn, "1");
                assert(abi.bignum(r.txHash).toNumber());
            },
            function (r) {
                // success
                assert.strictEqual(r.callReturn, "1");
                assert.notStrictEqual(abi.bignum(r.blockHash).toNumber(), 0);
                assert.isAbove(parseInt(r.blockNumber), 0);
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

    it("cashFaucet", function (done) {

        this.timeout(constants.TIMEOUT*4);

        function faucet() {
            augur.cashFaucet(
                function (r) {
                    // sent
                    assert(r.callReturn === "1" || r.callReturn === "-1");
                    assert(abi.bignum(r.txHash).toNumber());
                },
                function (r) {
                    // success
                    assert(r.callReturn === "1" || r.callReturn === "-1");
                    assert.notStrictEqual(abi.bignum(r.blockHash).toNumber(), 0);
                    var rep_balance = augur.getRepBalance(augur.branches.dev, augur.coinbase);
                    var cash_balance = augur.getCashBalance(augur.coinbase);
                    if (r.callReturn === "1") {
                        assert.strictEqual(cash_balance, "10000");
                    } else {
                        assert.isAbove(abi.bignum(cash_balance).toNumber(), 5);
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
            var start_balance = abi.bignum(cash_balance);
            augur.sendCash({
                to: "0x405be667f1a6b2d5149a61057040cade5aada366",
                value: start_balance.sub(new BigNumber(1)),
                onSent: function (r) {
                    // log(r);
                    assert.property(r, "txHash");
                    assert.property(r, "callReturn");
                },
                onSuccess: function (r) {
                    var final_balance = abi.bignum(
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
