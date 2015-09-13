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

var accounts = utils.get_test_accounts(augur, constants.MAX_TEST_ACCOUNTS);
var branch_id = augur.branches.dev;
var reporter_index = "0";
var ballot = [2, 2, 1, 2];
var salt = "1337";

describe("data and api/reporting", function () {

    describe("getTotalRep(" + branch_id + ")", function () {
        var test = function (r) {
            assert(parseInt(r) >= 44);
        };
        it("sync", function () {
            test(augur.getTotalRep(branch_id));
        });
        it("async", function (done) {
            augur.getTotalRep(branch_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            batch.add("getTotalRep", [branch_id], function (r) {
                test(r);
            });
            batch.add("getTotalRep", [branch_id], function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

    describe("getRepBalance(" + branch_id + ") ", function () {
        var test = function (r) {
            utils.gteq0(r);
        };
        it("sync", function () {
            test(augur.getRepBalance(branch_id, accounts[0]));
        });
        it("async", function (done) {
            augur.getRepBalance(branch_id, accounts[0], function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [branch_id, accounts[0]];
            batch.add("getRepBalance", params, function (r) {
                test(r);
            });
            batch.add("getRepBalance", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

    describe("getRepByIndex(" + branch_id + ", " + reporter_index + ") ", function () {
        var test = function (r) {
            assert(Number(r) >= 44);
        };
        it("sync", function () {
            test(augur.getRepByIndex(branch_id, reporter_index));
        });
        it("async", function (done) {
            augur.getRepByIndex(branch_id, reporter_index, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [branch_id, reporter_index];
            batch.add("getRepByIndex", params, function (r) {
                test(r);
            });
            batch.add("getRepByIndex", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

    describe("getReporterID(" + branch_id + ", " + reporter_index + ") ", function () {
        var test = function (r) {
            assert.isAbove(abi.bignum(r).toNumber(), 0);
            if (augur.rpc.nodes.local) {
                assert(abi.bignum(r).eq(abi.bignum(accounts[0])));
            }
        };
        it("sync", function () {
            test(augur.getReporterID(branch_id, reporter_index));
        });
        it("async", function (done) {
            augur.getReporterID(branch_id, reporter_index, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [branch_id, reporter_index];
            batch.add("getReporterID", params, function (r) {
                test(r);
            });
            batch.add("getReporterID", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

    describe("getNumberReporters(" + branch_id + ") ", function () {
        var test = function (r) {
            assert(parseInt(r) >= 1);
        };
        it("sync", function () {
            test(augur.getNumberReporters(branch_id));
        });
        it("async", function (done) {
            augur.getNumberReporters(branch_id, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [branch_id];
            batch.add("getNumberReporters", params, function (r) {
                test(r);
            });
            batch.add("getNumberReporters", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

    describe("repIDToIndex(" + branch_id + ", " + accounts[0] + ") ", function () {
        var test = function (r) {
            assert.strictEqual(r, reporter_index);
        };
        it("sync", function () {
            test(augur.repIDToIndex(branch_id, accounts[0]));
        });
        it("async", function (done) {
            augur.repIDToIndex(branch_id, accounts[0], function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [branch_id, accounts[0]];
            batch.add("repIDToIndex", params, function (r) {
                test(r);
            });
            batch.add("repIDToIndex", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

    describe("hashReport([ballot], " + salt + ") ", function () {
        var test = function (r) {
            // var b = abi.fix(ballot);
            // for (var i = 0, len = b.length; i < len; ++i) {
            //     b[i] = b[i].toString(16);
            // }
            // var hashable = [accounts[0], abi.bignum(salt).toString(16)].concat(b).toString();
            // var hashed = utils.sha256(hashable);
            // TODO lookup how arrays hashed by evm sha256, this doesn't work
            // assert.strictEqual(r, hashed);
            var r = abi.bignum(r);
            var rplus = r.plus(abi.constants.MOD);
            if (rplus.lt(abi.constants.BYTES_32)) {
                r = rplus;
            }
            var expected = (augur.network_id === '7') ?
                "-3be4c66e938ac10deff020022958af94584a35a5ce661a31522ff91bd40b990" :
                "-3bc32da7042e04b537160b3b24f53162cb621c482fb615aa108087898d6183fb";
            assert.strictEqual(r.toString(16), expected);
        };
        it("sync", function () {
            test(augur.hashReport(ballot, salt));
        });
        it("async", function (done) {
            augur.hashReport(ballot, salt, function (r) {
                test(r); done();
            });
        });
        it("batched-async", function (done) {
            var batch = augur.createBatch();
            var params = [abi.fix(ballot, "hex"), salt];
            batch.add("hashReport", params, function (r) {
                test(r);
            });
            batch.add("hashReport", params, function (r) {
                test(r); done();
            });
            batch.execute();
        });
    });

});
