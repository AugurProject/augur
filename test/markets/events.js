/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;
var log = console.log;

var amount = "1";
var branch_id = augur.branches.dev;
var markets = augur.getMarkets(branch_id);
var market_id = markets[markets.length - 1];
var event_id = augur.getMarketEvents(market_id)[0];

// events.se
describe("events.se", function () {
    describe("getEventInfo(" + event_id + ")", function () {
        var test = function (res) {
            assert(abi.bignum(res[0]).eq(abi.bignum(branch_id)));
            assert.strictEqual(res.length, 6);
        };
        it("sync", function () {
            test(augur.getEventInfo(event_id));
        });
        it("async", function (done) {
            augur.getEventInfo(event_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getEventInfo", [event_id], function (r) {
                test(r);
            });
            batch.add("getEventInfo", [event_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

    describe("getEventBranch(" + event_id + ")", function () {
        var test = function (r) {
            assert(abi.bignum(r).eq(abi.bignum(branch_id)));
        };
        it("sync", function () {
            test(augur.getEventBranch(event_id));
        });
        it("async", function (done) {
            augur.getEventBranch(event_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getEventBranch", [event_id], function (r) {
                test(r);
            });
            batch.add("getEventBranch", [event_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getExpiration(" + event_id + ")", function () {
        var test = function (r) {
            assert(parseInt(r) >= 10);
        };
        it("sync", function () {
            test(augur.getExpiration(event_id));
        });
        it("async", function (done) {
            augur.getExpiration(event_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getExpiration", [event_id], function (r) {
                test(r);
            });
            batch.add("getExpiration", [event_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getOutcome(" + event_id + ")", function () {
        var test = function (r) {
            assert.strictEqual(r, "0");
        };
        it("sync", function () {
            test(augur.getOutcome(event_id));
        });
        it("async", function (done) {
            augur.getOutcome(event_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getOutcome", [event_id], function (r) {
                test(r);
            });
            batch.add("getOutcome", [event_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getMinValue(" + event_id + ") == '1'", function () {
        var test = function (r) {
            assert.strictEqual(r, "0");
        };
        it("sync", function () {
            test(augur.getMinValue(event_id));
        });
        it("async", function (done) {
            augur.getMinValue(event_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getMinValue", [event_id], function (r) {
                test(r);
            });
            batch.add("getMinValue", [event_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getMaxValue(" + event_id + ") == '2'", function () {
        var test = function (r) {
            assert.strictEqual(r, "1");
        };
        it("sync", function () {
            test(augur.getMaxValue(event_id));
        });
        it("async", function (done) {
            augur.getMaxValue(event_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getMaxValue", [event_id], function (r) {
                test(r);
            });
            batch.add("getMaxValue", [event_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getNumOutcomes(" + event_id + ") == '2'", function () {
        var test = function (r) {
            assert.strictEqual(r, "2");
        };
        it("sync", function () {
            test(augur.getNumOutcomes(event_id));
        });
        it("async", function (done) {
            augur.getNumOutcomes(event_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getNumOutcomes", [event_id], function (r) {
                test(r);
            });
            batch.add("getNumOutcomes", [event_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
});
