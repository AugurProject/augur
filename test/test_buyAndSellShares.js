/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("assert");
var Augur = require("../augur");

Augur.connect();

var log = console.log;
var TIMEOUT = 120000;

var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);

var amount = "1";
var branch = Augur.branches.dev;
var outcome = Augur.NO.toString();
var markets = Augur.getMarkets(branch)
var market_id = markets[0];

describe("functions/buy&sellShares", function () {
    describe("getNonce(" + market_id + ") ", function () {
        var test = function (r) {
            assert.equal(r, "0");
        };
        it("sync", function () {
            test(Augur.getNonce(market_id));
        });
        it("async", function (done) {
            Augur.getNonce(market_id, function (r) {
                test(r); done();
            });
        });
    });
    it("buyShares(" + branch + ", " + market_id + ", " + outcome + ", " + amount + ", null)", function (done) {
        this.timeout(TIMEOUT);
        var amount = (Math.random() * 10 + 1).toString();
        Augur.buyShares({
            branchId: branch,
            marketId: market_id,
            outcome: outcome,
            amount: amount,
            nonce: null,
            onSent: function (r) {
                log(r);
            },
            onSuccess: function (r) {
                log(r); done();
            },
            onFailed: function (r) {
                // assert(r.error === "-1");
                log(r);
                done();
            }
        });
    });
    it("sellShares(" + branch + ", " + market_id + ", " + outcome + ", " + amount + ", null)", function (done) {
        this.timeout(TIMEOUT);
        var amount = (Math.random()).toString();
        Augur.sellShares({
            branchId: branch,
            marketId: market_id,
            outcome: outcome,
            amount: amount,
            nonce: null,
            onSent: function (r) {
                log(r);
            },
            onSuccess: function (r) {
                log(r); done();
            },
            onFailed: function (r) {
                // assert(r.error === "-1");
                log(r);
                done();
            }
        });
    });
});
