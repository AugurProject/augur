/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var utils = require("../../src/utilities");
var Augur = utils.setup(require("../../src"), process.argv.slice(2));
var numeric = Augur.numeric;
var constants = Augur.constants;
var log = console.log;

var payment_value = 1;
var branch = Augur.branches.dev;
var coinbase = Augur.coinbase;
var receiver = utils.get_test_accounts(Augur, constants.MAX_TEST_ACCOUNTS)[1];

describe("Payments", function () {

    it("sendEther", function (done) {
        this.timeout(constants.TIMEOUT);
        var start_balance = numeric.bignum(Augur.balance(receiver));
        start_balance = start_balance.dividedBy(constants.ETHER);
        Augur.sendEther({
            to: receiver,
            value: payment_value,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = Augur.balance(receiver);
                final_balance = numeric.bignum(final_balance).dividedBy(constants.ETHER);
                assert.strictEqual(final_balance.sub(start_balance).toNumber(), payment_value);
                done();
            }
        });
    });

    it("sendCash", function (done) {
        this.timeout(constants.TIMEOUT);
        var start_balance = numeric.bignum(Augur.getCashBalance(coinbase));
        Augur.sendCash({
            to: receiver,
            value: payment_value,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = numeric.bignum(Augur.getCashBalance(coinbase));
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
        var start_balance = numeric.bignum(Augur.getCashBalance(coinbase));
        Augur.sendCashFrom({
            to: receiver,
            value: payment_value,
            from: coinbase,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = numeric.bignum(Augur.getCashBalance(coinbase));
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
        var start_balance = Augur.getRepBalance(branch, coinbase);
        start_balance = numeric.bignum(start_balance);
        Augur.tx.sendReputation.returns = "number";
        Augur.sendReputation({
            branchId: branch,
            to: receiver,
            value: payment_value,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = Augur.getRepBalance(branch, coinbase);
                final_balance = numeric.bignum(final_balance);
                assert.strictEqual(start_balance.sub(final_balance).toNumber(), payment_value);
                done();
            },
            onFailed: function (r) {
                done(r);
            }
        });
    });

});
