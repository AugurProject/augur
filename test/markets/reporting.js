/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));

var accounts = utils.get_test_accounts(augur, augur.constants.MAX_TEST_ACCOUNTS);
var branchId = augur.branches.dev;
var reporter_index = "0";
var ballot = [2, 2, 1, 2];
var salt = "1337";

describe("data_api/reporting", function () {

    describe("getTotalRep(" + branchId + ")", function () {
        var test = function (r) {
            assert(parseInt(r) >= 44);
        };
        it("sync", function () {
            test(augur.getTotalRep(branchId));
        });
        it("async", function (done) {
            augur.getTotalRep(branchId, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getTotalRep", [branchId], function (r) {
                test(r);
            });
            batch.add("getTotalRep", [branchId], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

    describe("getRepBalance(" + branchId + ") ", function () {
        var test = function (r) {
            utils.gteq0(r);
        };
        it("sync", function () {
            test(augur.getRepBalance(branchId, accounts[0]));
        });
        it("async", function (done) {
            augur.getRepBalance(branchId, accounts[0], function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [branchId, accounts[0]];
            batch.add("getRepBalance", params, function (r) {
                test(r);
            });
            batch.add("getRepBalance", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

    describe("getRepByIndex(" + branchId + ", " + reporter_index + ") ", function () {
        var test = function (r) {
            assert(Number(r) >= 0);
        };
        it("sync", function () {
            test(augur.getRepByIndex(branchId, reporter_index));
        });
        it("async", function (done) {
            augur.getRepByIndex(branchId, reporter_index, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [branchId, reporter_index];
            batch.add("getRepByIndex", params, function (r) {
                test(r);
            });
            batch.add("getRepByIndex", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

    describe("getReporterID(" + branchId + ", " + reporter_index + ") ", function () {
        var test = function (r) {
            assert.isAbove(abi.bignum(r).toNumber(), 0);
            if (augur.rpc.nodes.local) {
                assert(abi.bignum(r).eq(abi.bignum(accounts[0])));
            }
        };
        it("sync", function () {
            test(augur.getReporterID(branchId, reporter_index));
        });
        it("async", function (done) {
            augur.getReporterID(branchId, reporter_index, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [branchId, reporter_index];
            batch.add("getReporterID", params, function (r) {
                test(r);
            });
            batch.add("getReporterID", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

    describe("getNumberReporters(" + branchId + ") ", function () {
        var test = function (r) {
            assert(parseInt(r) >= 1);
        };
        it("sync", function () {
            test(augur.getNumberReporters(branchId));
        });
        it("async", function (done) {
            augur.getNumberReporters(branchId, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [branchId];
            batch.add("getNumberReporters", params, function (r) {
                test(r);
            });
            batch.add("getNumberReporters", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

    describe("repIDToIndex(" + branchId + ", " + accounts[0] + ") ", function () {
        var test = function (r) {
            assert(parseInt(r) >= 0);
        };
        it("sync", function () {
            test(augur.repIDToIndex(branchId, accounts[0]));
        });
        it("async", function (done) {
            augur.repIDToIndex(branchId, accounts[0], function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [branchId, accounts[0]];
            batch.add("repIDToIndex", params, function (r) {
                test(r);
            });
            batch.add("repIDToIndex", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

});
