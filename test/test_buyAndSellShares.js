/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
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

var eventsMarkets = fs.readFile("events.dat").toString().split('\n');
var events = Augur.getEvents(branch, period);
log("Events in vote period " + period + ":");
log(events);

var markets = new Array(events.length);
var this_event_market;
for (var i = 0; i < eventsMarkets.length; ++i) {
    this_event_market = eventsMarkets[i].split(',');
    for (var j = 0; j < events.length; ++j) {
        if (this_event_market[0] === events[j]) {
            markets[i] = this_event_market[1];
            break;
        }
    }
}
log("Buying shares of " + markets.length + " markets:");
log(markets);

// should already be at correct vote period from checkQuorum tests


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
