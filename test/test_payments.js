/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var assert = require("assert");
var Augur = require("../augur");
var constants = require("./constants");

Augur.connect();

var log = console.log;
var TIMEOUT = 120000;

describe("Payment methods", function () {

    var amount = "1";
    var branch_id = Augur.branches.dev;
    var receiving_account = constants.accounts.joey;

    it("pay: complete call-send-confirm callback sequence", function (done) {
        this.timeout(TIMEOUT);
        var start_balance = Augur.bignum(Augur.balance()).dividedBy(Augur.ETHER);
        var value = 10;
        var tx = {
            to: constants.accounts.loopy,
            value: value,
            onSent: function (res) {
                log(res);
            },
            onSuccess: function (res) {
                log("success: " + JSON.stringify(res, null, 2));
                var final_balance = Augur.bignum(Augur.balance()).dividedBy(Augur.ETHER);
                assert.equal(start_balance.sub(final_balance).toNumber(), value);
                done();
            }
        };
        Augur.pay(tx);
    });
    it("sendCash: complete call-send-confirm callback sequence", function (done) {
        this.timeout(TIMEOUT);
        var start_balance = Augur.bignum(Augur.getCashBalance());
        var value = 10;
        Augur.sendCash({
            to: constants.accounts.loopy,
            value: value,
            onSent: function (res) {
                log(res);
            },
            onSuccess: function (res) {
                log("success: " + JSON.stringify(res, null, 2));
                var final_balance = Augur.bignum(Augur.getCashBalance());
                assert.equal(start_balance.sub(final_balance).toNumber(), value);
                done();
            },
            onFailed: function (res) {
                log("failed: " + JSON.stringify(res, null, 2));
                done();
            }
        });
    });
    it("sendReputation: complete call-send-confirm callback sequence", function (done) {
        this.timeout(TIMEOUT);
        var start_balance = Augur.bignum(Augur.getRepBalance(Augur.branches.demo));
        var value = 10;
        Augur.sendReputation({
            branchId: Augur.branches.demo,
            to: constants.accounts.joey,
            value: value,
            onSent: function (res) {
                log(res);
            },
            onSuccess: function (res) {
                log("success: " + JSON.stringify(res, null, 2));
                var final_balance = Augur.bignum(Augur.getRepBalance(Augur.branches.dev));
                assert.equal(start_balance.sub(final_balance).toNumber(), value);
                done();
            },
            onFailed: function (res) {
                log("failed: " + JSON.stringify(res, null, 2));
                done();
            }
        });
    });
});
