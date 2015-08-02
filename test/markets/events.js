/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var Augur = utils.setup(require("../../src"), process.argv.slice(2));
var log = console.log;

var amount = "1";
var branch_id = Augur.branches.dev;
var markets = Augur.getMarkets(branch_id);
var market_id = markets[markets.length - 1];
var event_id = Augur.getMarketEvents(market_id)[0];

// events.se
describe("events.se", function () {
    describe("getEventInfo(" + event_id + ")", function () {
        var test = function (res) {
            assert.strictEqual(res[0], branch_id);
            assert.strictEqual(res.length, 6);
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
            assert.strictEqual(r, branch_id);
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
            assert.strictEqual(r, "0");
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
            assert.strictEqual(r, "0");
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
            assert.strictEqual(r, "1");
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
            assert.strictEqual(r, "2");
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
