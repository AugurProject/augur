/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("assert");
var Augur = require("../augur");
var constants = require("./constants");

Augur.connect();

var log = console.log;

function gteq0(n) { return (parseFloat(n) >= 0); }

var amount = "1";
var branch_id = Augur.branches.dev;
var branch_number = "1";
var reporter_index = "0";
var reporter_address = constants.accounts.jack;
var ballot = [Augur.YES, Augur.YES, Augur.NO, Augur.YES];
var salt = "1337";

describe("data and api/reporting", function () {
    describe("getTotalRep(" + branch_id + ")", function () {
        var test = function (r) {
            assert.equal(r, "94");
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
            gteq0(r);
        };
        it("sync", function () {
            test(Augur.getRepBalance(branch_id, Augur.coinbase));
        });
        it("async", function (done) {
            Augur.getRepBalance(branch_id, Augur.coinbase, function (r) {
                test(r); done();
            });
        });
    });
    describe("getRepByIndex(" + branch_id + ", " + reporter_index + ") ", function () {
        var test = function (r) {
            gteq0(r);
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
            assert.equal(r, Augur.coinbase);
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
    describe("getReputation(" + Augur.coinbase + ")", function () {
        var test = function (r) {
            assert(r.length >= 1);
            for (var i = 0, len = r.length; i < len; ++i) {
                gteq0(r[i]);
            }
        };
        it("sync", function () {
            test(Augur.getReputation(Augur.coinbase));
        });
        it("async", function (done) {
            Augur.getReputation(Augur.coinbase, function (r) {
                test(r); done();
            });
        });
    });
    describe("getNumberReporters(" + branch_id + ") ", function () {
        var test = function (r) {
            gteq0(r);
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
    describe("repIDToIndex(" + branch_id + ", " + Augur.coinbase + ") ", function () {
        var test = function (r) {
            assert.equal(r, reporter_index);
        };
        it("sync", function () {
            test(Augur.repIDToIndex(branch_id, Augur.coinbase));
        });
        it("async", function (done) {
            Augur.repIDToIndex(branch_id, Augur.coinbase, function (r) {
                test(r); done();
            });
        });
    });
    describe("hashReport([ballot], " + salt + ") ", function () {
        var test = function (r) {
            assert.equal(r, "0x6a3e1f23a899abb1e670f9aedd8cdebea1ce0835542beab1cd2ab50e0e2f28a9");
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
    Augur.tx.reputationFaucet.send = false;
    Augur.tx.reputationFaucet.returns = "number";
    describe("reputationFaucet(" + branch_id + ") ", function () {
        var test = function (r) {
            assert.equal(r, "1");
        };
        it("sync", function () {
            test(Augur.reputationFaucet(branch_id));
        });
        it("async", function (done) {
            Augur.reputationFaucet(branch_id, function (r) {
                test(r); done();
            });
        });
    });
});
