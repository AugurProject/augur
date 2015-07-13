/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var crypto = require("crypto");
var assert = require("chai").assert;
var constants = require("../src/constants");
var utilities = require("../src/utilities");
var numeric = require("../src/numeric");
var Augur = utilities.setup(require("../src"), process.argv.slice(2));
var log = console.log;

var accounts = utilities.get_test_accounts(Augur, constants.max_test_accounts);
var branch_id = Augur.branches.dev;
var reporter_index = "0";
var ballot = [2, 2, 1, 2];
var salt = "1337";

describe("data and api/reporting", function () {
    describe("getTotalRep(" + branch_id + ")", function () {
        var test = function (r) {
            assert(parseInt(r) >= 47);
        };
        it("sync", function () {
            test(Augur.getTotalRep(branch_id));
        });
        it("async", function (done) {
            Augur.getTotalRep(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getRepBalance(" + branch_id + ") ", function () {
        var test = function (r) {
            utilities.gteq0(r);
        };
        it("sync", function () {
            test(Augur.getRepBalance(branch_id, accounts[0]));
        });
        it("async", function (done) {
            Augur.getRepBalance(branch_id, accounts[0], function (r) {
                test(r); done();
            });
        });
    });
    describe("getRepByIndex(" + branch_id + ", " + reporter_index + ") ", function () {
        var test = function (r) {
            utilities.gteq0(r);
            assert.equal(Number(r), 47);
        };
        it("sync", function () {
            test(Augur.getRepByIndex(branch_id, reporter_index));
        });
        it("async", function (done) {
            Augur.getRepByIndex(branch_id, reporter_index, function (r) {
                test(r); done();
            });
        });
    });
    describe("getReporterID(" + branch_id + ", " + reporter_index + ") ", function () {
        var test = function (r) {
            assert.equal(r, accounts[0]);
        };
        it("sync", function () {
            test(Augur.getReporterID(branch_id, reporter_index));
        });
        it("async", function (done) {
            Augur.getReporterID(branch_id, reporter_index, function (r) {
                test(r); done();
            });
        });
    });
    describe("getReputation(" + accounts[0] + ")", function () {
        var test = function (r) {
            assert(r.length >= 1);
            for (var i = 0, len = r.length; i < len; ++i) {
                utilities.gteq0(r[i]);
            }
        };
        it("sync", function () {
            test(Augur.getReputation(accounts[0]));
        });
        it("async", function (done) {
            Augur.getReputation(accounts[0], function (r) {
                test(r); done();
            });
        });
    });
    describe("getNumberReporters(" + branch_id + ") ", function () {
        var test = function (r) {
            assert(parseInt(r) >= 1);
        };
        it("sync", function () {
            test(Augur.getNumberReporters(branch_id));
        });
        it("async", function (done) {
            Augur.getNumberReporters(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("repIDToIndex(" + branch_id + ", " + accounts[0] + ") ", function () {
        var test = function (r) {
            assert.equal(r, reporter_index);
        };
        it("sync", function () {
            test(Augur.repIDToIndex(branch_id, accounts[0]));
        });
        it("async", function (done) {
            Augur.repIDToIndex(branch_id, accounts[0], function (r) {
                test(r); done();
            });
        });
    });
    describe("hashReport([ballot], " + salt + ") ", function () {
        var test = function (r) {
            var b = numeric.fix(ballot);
            for (var i = 0, len = b.length; i < len; ++i) {
                b[i] = b[i].toString(16);
            }
            var hashable = [accounts[0], numeric.bignum(salt).toString(16)].concat(b).toString();
            var hashed = utilities.sha256(hashable);
            // TODO lookup how arrays hashed by evm sha256, this doesn't work
            // assert.equal(r, hashed);
            assert.equal(r, "0xc43cd258fbd1fb4ac8e9f4c4db0ace9d349de3b7d049ea55ef7f7876729e7c05");
        };
        it("sync", function () {
            test(Augur.hashReport(ballot, salt));
        });
        it("async", function (done) {
            Augur.hashReport(ballot, salt, function (r) {
                test(r); done();
            });
        });
    });
});
