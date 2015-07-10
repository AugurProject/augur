/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var constants = require("./constants");
var utilities = require("./utilities");
var Augur = utilities.setup(require("../augur"), process.argv.slice(2));
var log = console.log;

var payment_value = 10;

describe("Payment methods", function () {

    var amount = "1";
    var branch_id = Augur.branches.dev;
    var receiver = utilities.get_test_accounts(Augur, constants.max_test_accounts)[1];

    it("pay: complete call-send-confirm callback sequence", function (done) {
        this.timeout(constants.timeout);
        var start_balance = Augur.numeric.bignum(Augur.rpc.balance(receiver)).dividedBy(Augur.ETHER);
        var tx = {
            to: receiver,
            value: payment_value,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = Augur.numeric.bignum(Augur.rpc.balance(receiver)).dividedBy(Augur.ETHER);
                assert.equal(final_balance.sub(start_balance).toNumber(), payment_value);
                done();
            }
        };
        Augur.rpc.pay(tx);
    });
    it("sendCash: complete call-send-confirm callback sequence", function (done) {
        this.timeout(constants.timeout);
        var start_balance = Augur.numeric.bignum(Augur.getCashBalance(Augur.coinbase));
        Augur.sendCash({
            to: receiver,
            value: payment_value,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = Augur.numeric.bignum(Augur.getCashBalance(Augur.coinbase));
                assert.equal(start_balance.sub(final_balance).toNumber(), payment_value);
                done();
            },
            onFailed: function (res) {
                throw new Error(JSON.stringify(res, null, 2));
                done();
            }
        });
    });
    it("sendReputation: complete call-send-confirm callback sequence", function (done) {
        this.timeout(constants.timeout);
        var start_balance = Augur.numeric.bignum(Augur.getRepBalance(Augur.branches.dev));
        Augur.sendReputation({
            branchId: Augur.branches.dev,
            to: receiver,
            value: payment_value,
            onSent: function (res) {
                // log(res);
            },
            onSuccess: function (res) {
                var final_balance = Augur.numeric.bignum(Augur.getRepBalance(Augur.branches.dev));
                assert.equal(start_balance.sub(final_balance).toNumber(), payment_value);
                done();
            },
            onFailed: function (res) {
                throw new Error(JSON.stringify(res, null, 2));
                done();
            }
        });
    });
});
