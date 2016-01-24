/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));

var branch_id = augur.branches.dev;
var branch_number = "0";

// branches.se
describe("branches.se", function () {
    describe("getBranches", function () {
        var test = function (r) {
            assert.isArray(r);
            assert.isAbove(r.length, 0);
            assert(abi.bignum(r[0]).eq(abi.bignum(branch_id)));
        };
        it("sync", function () {
            test(augur.getBranches());
        });
        it("async", function (done) {
            augur.getBranches(function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getBranches", [], function (r) {
                test(r);
            });
            batch.add("getBranches", [], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getMarkets(" + branch_id + ")", function () {
        var test = function (r) {
            assert.isArray(r);
            assert.isAbove(r.length, 1);
        };
        it("sync", function () {
            test(augur.getMarkets(branch_id));
        });
        it("async", function (done) {
            augur.getMarkets(branch_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getMarkets", [branch_id], function (r) {
                test(r);
            });
            batch.add("getMarkets", [branch_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getPeriodLength(" + branch_id + ") == '1800'", function () {
        var test = function (r) {
            assert.strictEqual(r, "1800");
        };
        it("sync", function () {
            test(augur.getPeriodLength(branch_id));
        });
        it("async", function (done) {
            augur.getPeriodLength(branch_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getPeriodLength", [branch_id], function (r) {
                test(r);
            });
            batch.add("getPeriodLength", [branch_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getVotePeriod(" + branch_id + ") >= -1", function () {
        var test = function (r) {
            assert(parseInt(r) >= -1);
        };
        it("sync", function () {
            test(augur.getVotePeriod(branch_id));
        });
        it("async", function (done) {
            augur.getVotePeriod(branch_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getVotePeriod", [branch_id], function (r) {
                test(r);
            });
            batch.add("getVotePeriod", [branch_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getStep(" + branch_id + ") == 0", function () {
        var test = function (r) {
            assert.strictEqual(parseInt(r), 0);
        };
        it("sync", function () {
            test(augur.getStep(branch_id));
        });
        it("async", function (done) {
            augur.getStep(branch_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getStep", [branch_id], function (r) {
                test(r);
            });
            batch.add("getStep", [branch_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getNumMarkets(" + branch_id + ") >= 1", function () {
        var test = function (r) {
            assert(parseInt(r) >= 1);
        };
        it("sync", function () {
            test(augur.getNumMarkets(branch_id));
        });
        it("async", function (done) {
            augur.getNumMarkets(branch_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getNumMarkets", [branch_id], function (r) {
                test(r);
            });
            batch.add("getNumMarkets", [branch_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getMinTradingFee(" + branch_id + ")", function () {
        var test = function (r) {
            assert(Number(r) >= 0.0);
            assert(Number(r) <= 1.0);
        };
        it("sync", function () {
            test(augur.getMinTradingFee(branch_id));
        });
        it("async", function (done) {
            augur.getMinTradingFee(branch_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getMinTradingFee", [branch_id], function (r) {
                test(r);
            });
            batch.add("getMinTradingFee", [branch_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getNumBranches()", function () {
        var test = function (r) {
            assert.isAbove(parseInt(r), 0);
        };
        it("sync", function () {
            test(augur.getNumBranches());
        });
        it("async", function (done) {
            augur.getNumBranches(function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getNumBranches", [], function (r) {
                test(r);
            });
            batch.add("getNumBranches", [], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
    describe("getBranch(" + branch_number + ")", function () {
        var test = function (r) {
            assert(abi.bignum(r).eq(abi.bignum(branch_id)));
        };
        it("sync", function () {
            test(augur.getBranch(branch_number));
        });
        it("async", function (done) {
            augur.getBranch(branch_number, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getBranch", [branch_number], function (r) {
                test(r);
            });
            batch.add("getBranch", [branch_number], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });
});
