/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var Augur = require("../src");
var constants = require("../src/constants");
var log = console.log;

Augur = require("../src/utilities").setup(Augur, process.argv.slice(2));

var TIMEOUT = 24000;
var amount = "1";
var branch_id = Augur.branches.dev;
var markets = Augur.getMarkets(branch_id);
var market_id = markets[markets.length - 1];
var event_id = Augur.getMarketEvents(market_id)[0];

// events.se
describe("events.se", function () {
    describe("getEventInfo(" + event_id + ")", function () {
        var test = function (res) {
            assert.equal(res[0], branch_id);
            assert.equal(res.length, 6);
        };
        it("sync", function () {
            test(Augur.getEventInfo(event_id));
        });
        it("async", function (done) {
            Augur.getEventInfo(event_id, function (r) {
                test(r); done();
            });
        });
    });

    describe("getEventBranch(" + event_id + ")", function () {
        var test = function (r) {
            assert.equal(r, branch_id);
        };
        it("sync", function () {
            test(Augur.getEventBranch(event_id));
        });
        it("async", function (done) {
            Augur.getEventBranch(event_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getExpiration(" + event_id + ")", function () {
        var test = function (r) {
            assert(parseInt(r) >= 10);
        };
        it("sync", function () {
            test(Augur.getExpiration(event_id));
        });
        it("async", function (done) {
            Augur.getExpiration(event_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getOutcome(" + event_id + ")", function () {
        var test = function (r) {
            assert.equal(r, "0");
        };
        it("sync", function () {
            test(Augur.getOutcome(event_id));
        });
        it("async", function (done) {
            Augur.getOutcome(event_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getMinValue(" + event_id + ") == '1'", function () {
        var test = function (r) {
            assert.equal(r, "0");
        };
        it("sync", function () {
            test(Augur.getMinValue(event_id));
        });
        it("async", function (done) {
            Augur.getMinValue(event_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getMaxValue(" + event_id + ") == '2'", function () {
        var test = function (r) {
            assert.equal(r, "1");
        };
        it("sync", function () {
            test(Augur.getMaxValue(event_id));
        });
        it("async", function (done) {
            Augur.getMaxValue(event_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getNumOutcomes(" + event_id + ") == '2'", function () {
        var test = function (r) {
            assert.equal(r, "2");
        };
        it("sync", function () {
            test(Augur.getNumOutcomes(event_id));
        });
        it("async", function (done) {
            Augur.getNumOutcomes(event_id, function (r) {
                test(r); done();
            });
        });
    });
});
