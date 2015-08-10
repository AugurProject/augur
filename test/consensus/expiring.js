/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;
var numeric = augur.numeric;
var log = console.log;

var branch = augur.branches.dev;
var period = augur.getVotePeriod(branch);
var num_events = parseInt(augur.getNumberEvents(branch, period));
var num_reports = parseInt(augur.getNumberReporters(branch));
var flatsize = num_events * num_reports;

var accounts = utils.get_test_accounts(augur, constants.MAX_TEST_ACCOUNTS);
var receiving_account = accounts[1];

describe("data and api/expiringEvents", function () {
    describe("getEvents(" + branch + ", " + period + ")", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getEvents(branch, period));
        });
        it("async", function (done) {
            augur.getEvents(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getNumberEvents", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getNumberEvents(branch, period));
        });
        it("async", function (done) {
            augur.getNumberEvents(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getEvent", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getEvent(branch, period, 0));
        });
        it("async", function (done) {
            augur.getEvent(branch, period, 0, function (r) {
                test(r); done();
            });
        });
    });
    describe("getTotalRepReported", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getTotalRepReported(branch, period));
        });
        it("async", function (done) {
            augur.getTotalRepReported(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getReporterBallot", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getReporterBallot(branch, period));
        });
        it("async", function (done) {
            augur.getReporterBallot(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getReport", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getReport(branch, period, augur.coinbase, 0));
        });
        it("async", function (done) {
            augur.getReport(branch, period, augur.coinbase, 0, function (r) {
                test(r); done();
            });
        });
    });
    describe("getReportHash", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getReportHash(branch, period, augur.coinbase));
        });
        it("async", function (done) {
            augur.getReportHash(branch, period, augur.coinbase, function (r) {
                test(r); done();
            });
        });
    });
    describe("getVSize", function () {
        var test = function (r) {
            assert.strictEqual(parseInt(r), flatsize);
            log(r);
        };
        it("sync", function () {
            test(augur.getVSize(branch, period));
        });
        it("async", function (done) {
            augur.getVSize(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getReportsFilled", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getReportsFilled(branch, period));
        });
        it("async", function (done) {
            augur.getReportsFilled(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getReportsMask", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getReportsMask(branch, period));
        });
        it("async", function (done) {
            augur.getReportsMask(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getWeightedCenteredData", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getWeightedCenteredData(branch, period));
        });
        it("async", function (done) {
            augur.getWeightedCenteredData(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getCovarianceMatrixRow", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getCovarianceMatrixRow(branch, period));
        });
        it("async", function (done) {
            augur.getCovarianceMatrixRow(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getDeflated", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getDeflated(branch, period));
        });
        it("async", function (done) {
            augur.getDeflated(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getLoadingVector", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getLoadingVector(branch, period));
        });
        it("async", function (done) {
            augur.getLoadingVector(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getLatent", function () {
        var test = function (r) {
            assert(numeric.bignum(r).toNumber >= 0);
            log(r);
        };
        it("sync", function () {
            test(augur.getLatent(branch, period));
        });
        it("async", function (done) {
            augur.getLatent(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getScores", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getScores(branch, period));
        });
        it("async", function (done) {
            augur.getScores(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getSetOne", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getSetOne(branch, period));
        });
        it("async", function (done) {
            augur.getSetOne(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getSetTwo", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getSetTwo(branch, period));
        });
        it("async", function (done) {
            augur.getSetTwo(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("returnOld", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.returnOld(branch, period));
        });
        it("async", function (done) {
            augur.returnOld(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getNewOne", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getNewOne(branch, period));
        });
        it("async", function (done) {
            augur.getNewOne(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getNewTwo", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getNewTwo(branch, period));
        });
        it("async", function (done) {
            augur.getNewTwo(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getAdjPrinComp", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getAdjPrinComp(branch, period));
        });
        it("async", function (done) {
            augur.getAdjPrinComp(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getSmoothRep", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getSmoothRep(branch, period));
        });
        it("async", function (done) {
            augur.getSmoothRep(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getOutcomesFinal", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getOutcomesFinal(branch, period));
        });
        it("async", function (done) {
            augur.getOutcomesFinal(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getTotalReputation", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.getTotalReputation(branch, period));
        });
        it("async", function (done) {
            augur.getTotalReputation(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("setTotalReputation", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(augur.setTotalReputation(branch, period, 10));
        });
        it("async", function (done) {
            augur.setTotalReputation(branch, period, 10, function (r) {
                test(r); done();
            });
        });
    });
});
