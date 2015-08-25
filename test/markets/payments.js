/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var abi = require("augur-abi");
var constants = augur.constants;
var log = console.log;

var payment_value = 1;
var branch = augur.branches.dev;
var coinbase = augur.coinbase;
var receiver = utils.get_test_accounts(augur, constants.MAX_TEST_ACCOUNTS)[1];

describe("Payments", function () {

    it("sendEther", function (done) {
        this.timeout(constants.TIMEOUT);
        var start_balance = abi.bignum(augur.rpc.balance(receiver));
        start_balance = start_balance.dividedBy(constants.ETHER);
        augur.rpc.sendEther({
            to: receiver,
            value: payment_value,
            from: augur.coinbase,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = augur.rpc.balance(receiver);
                final_balance = abi.bignum(final_balance).dividedBy(constants.ETHER);
                assert.strictEqual(final_balance.sub(start_balance).toNumber(), payment_value);
                done();
            }
        });
    });

    it("sendCash", function (done) {
        this.timeout(constants.TIMEOUT);
        var start_balance = abi.bignum(augur.getCashBalance(coinbase));
        augur.sendCash({
            to: receiver,
            value: payment_value,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = abi.bignum(augur.getCashBalance(coinbase));
                assert.strictEqual(start_balance.sub(final_balance).toNumber(), payment_value);
                done();
            },
            onFailed: function (r) {
                done(r);
            }
        });
    });

    it("sendCashFrom", function (done) {
        this.timeout(constants.TIMEOUT);
        var start_balance = abi.bignum(augur.getCashBalance(coinbase));
        augur.sendCashFrom({
            to: receiver,
            value: payment_value,
            from: coinbase,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = abi.bignum(augur.getCashBalance(coinbase));
                assert.strictEqual(start_balance.sub(final_balance).toNumber(), payment_value);
                done();
            },
            onFailed: function (r) {
                r.name = r.error; throw r;
                done();
            }
        });
    });

    it("sendReputation", function (done) {
        this.timeout(constants.TIMEOUT);
        var start_balance = augur.getRepBalance(branch, coinbase);
        start_balance = abi.bignum(start_balance);
        augur.tx.sendReputation.returns = "number";
        augur.sendReputation({
            branchId: branch,
            to: receiver,
            value: payment_value,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = augur.getRepBalance(branch, coinbase);
                final_balance = abi.bignum(final_balance);
                assert.strictEqual(start_balance.sub(final_balance).toNumber(), payment_value);
                done();
            },
            onFailed: function (r) {
                done(r);
            }
        });
    });

});
