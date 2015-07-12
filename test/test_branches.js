/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var Augur = require("../src/augur");
var constants = require("../src/constants");
var log = console.log;

Augur = require("../src/utilities").setup(Augur, process.argv.slice(2));

var branch_id = Augur.branches.dev;
var branch_number = "0";

// branches.se
describe("branches.se", function () {
    describe("getBranches", function () {
        var test = function (r) {
            assert.equal(r.constructor, Array);
            assert.equal(r.length, 1);
            assert.equal(r[0], branch_id);
        };
        it("sync", function () {
            test(Augur.getBranches());
        });
        it("async", function (done) {
            Augur.getBranches(function (r) {
                test(r); done();
            });
        });
    });
    describe("getMarkets(" + branch_id + ")", function () {
        var test = function (r) {
            assert.equal(r.constructor, Array);
            assert(r.length > 1);
        };
        it("sync", function () {
            test(Augur.getMarkets(branch_id));
        });
        it("async", function (done) {
            Augur.getMarkets(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getPeriodLength(" + branch_id + ") == '1800'", function () {
        var test = function (r) {
            assert.equal(r, "1800");
        };
        it("sync", function () {
            test(Augur.getPeriodLength(branch_id));
        });
        it("async", function (done) {
            Augur.getPeriodLength(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getVotePeriod(" + branch_id + ") in [-1, 100]", function () {
        var test = function (r) {
            assert(parseInt(r) >= -1);
            assert(parseInt(r) <= 100);
        };
        it("sync", function () {
            test(Augur.getVotePeriod(branch_id));
        });
        it("async", function (done) {
            Augur.getVotePeriod(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getStep(" + branch_id + ") == 0", function () {
        var test = function (r) {
            assert.equal(parseInt(r), 0);
        };
        it("sync", function () {
            test(Augur.getStep(branch_id));
        });
        it("async", function (done) {
            Augur.getStep(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getNumMarkets(" + branch_id + ") >= 1", function () {
        var test = function (r) {
            assert(parseInt(r) >= 1);
        };
        it("sync", function () {
            test(Augur.getNumMarkets(branch_id));
        });
        it("async", function (done) {
            Augur.getNumMarkets(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getMinTradingFee(" + branch_id + ")", function () {
        var test = function (r) {
            assert(Number(r) >= 0.0);
            assert(Number(r) <= 1.0);
        };
        it("sync", function () {
            test(Augur.getMinTradingFee(branch_id));
        });
        it("async", function (done) {
            Augur.getMinTradingFee(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getNumBranches()", function () {
        var test = function (r) {
            assert.equal(parseInt(r), 1);
        };
        it("sync", function () {
            test(Augur.getNumBranches());
        });
        it("async", function (done) {
            Augur.getNumBranches(function (r) {
                test(r); done();
            });
        });
    });
    describe("getBranch(" + branch_number + ")", function () {
        var test = function (r) {
            assert.equal(r, branch_id);
        };
        it("sync", function () {
            test(Augur.getBranch(branch_number));
        });
        it("async", function (done) {
            Augur.getBranch(branch_number, function (r) {
                test(r); done();
            });
        });
    });
});
