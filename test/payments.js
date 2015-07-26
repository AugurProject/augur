/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var constants = require("../src/constants");
var utilities = require("../src/utilities");
var numeric = require("../src/numeric");
var Augur = utilities.setup(require("../src"), process.argv.slice(2));
var log = console.log;

var payment_value = 1;

describe("Payments", function () {

    var amount = "1";
    var branch_id = Augur.branches.dev;
    var receiver = utilities.get_test_accounts(Augur, constants.max_test_accounts)[1];

    it("sendEther", function (done) {
        this.timeout(constants.timeout);
        var start_balance = numeric.bignum(Augur.balance(receiver)).dividedBy(constants.ETHER);
        var tx = {
            to: receiver,
            value: payment_value,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = numeric.bignum(Augur.balance(receiver)).dividedBy(constants.ETHER);
                assert.equal(final_balance.sub(start_balance).toNumber(), payment_value);
                done();
            }
        };
        Augur.pay(tx);
    });
    it("sendCash", function (done) {
        this.timeout(constants.timeout);
        var start_balance = numeric.bignum(Augur.getCashBalance(Augur.coinbase));
        Augur.sendCash({
            to: receiver,
            value: payment_value,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = numeric.bignum(Augur.getCashBalance(Augur.coinbase));
                assert.equal(start_balance.sub(final_balance).toNumber(), payment_value);
                done();
            },
            onFailed: function (r) {
                r.name = r.error; throw r;
                done();
            }
        });
    });
    it("sendCashFrom", function (done) {
        this.timeout(constants.timeout);
        var start_balance = numeric.bignum(Augur.getCashBalance(Augur.coinbase));
        Augur.sendCashFrom({
            to: receiver,
            value: payment_value,
            from: Augur.coinbase,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = numeric.bignum(Augur.getCashBalance(Augur.coinbase));
                assert.equal(start_balance.sub(final_balance).toNumber(), payment_value);
                done();
            },
            onFailed: function (r) {
                r.name = r.error; throw r;
                done();
            }
        });
    });
    it("sendReputation", function (done) {
        this.timeout(constants.timeout);
        var start_balance = numeric.bignum(Augur.getRepBalance(Augur.branches.dev));
        Augur.sendReputation({
            branchId: Augur.branches.dev,
            to: receiver,
            value: payment_value,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = numeric.bignum(Augur.getRepBalance(Augur.branches.dev));
                assert.equal(start_balance.sub(final_balance).toNumber(), payment_value);
                done();
            },
            onFailed: function (r) {
                r.name = r.error; throw r;
                done();
            }
        });
    });
});
