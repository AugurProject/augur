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

function fold(arr, num_cols) {
    var folded = [];
    num_cols = parseInt(num_cols);
    var num_rows = arr.length / num_cols;
    if (num_rows !== parseInt(num_rows)) {
        throw("array length (" + arr.length + ") not divisible by " + num_cols);
    }
    num_rows = parseInt(num_rows);
    var row;
    for (var i = 0; i < parseInt(num_rows); ++i) {
        row = [];
        for (var j = 0; j < num_cols; ++j) {
            row.push(arr[i*num_cols + j]);
        }
        folded.push(row);
    }
    return folded;
}

var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);
var num_events = parseInt(Augur.getNumberEvents(branch, period));
var num_reports = parseInt(Augur.getNumberReporters(branch));
var flatsize = num_events * num_reports;
var receiving_account = constants.chain10101.accounts.tinybike_new;

describe("data and api/expiringEvents", function () {
    describe("getEvents(" + branch + ", " + period + ")", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getEvents(branch, period));
        });
        it("async", function (done) {
            Augur.getEvents(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getNumberEvents", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getNumberEvents(branch, period));
        });
        it("async", function (done) {
            Augur.getNumberEvents(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getEvent", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getEvent(branch, period, 0));
        });
        it("async", function (done) {
            Augur.getEvent(branch, period, 0, function (r) {
                test(r); done();
            });
        });
    });
    describe("getTotalRepReported", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getTotalRepReported(branch, period));
        });
        it("async", function (done) {
            Augur.getTotalRepReported(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getReporterBallot", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getReporterBallot(branch, period));
        });
        it("async", function (done) {
            Augur.getReporterBallot(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getReport", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getReport(branch, period, Augur.coinbase, 0));
        });
        it("async", function (done) {
            Augur.getReport(branch, period, Augur.coinbase, 0, function (r) {
                test(r); done();
            });
        });
    });
    describe("getReportHash", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getReportHash(branch, period, Augur.coinbase));
        });
        it("async", function (done) {
            Augur.getReportHash(branch, period, Augur.coinbase, function (r) {
                test(r); done();
            });
        });
    });
    describe("getVSize", function () {
        var test = function (r) {
            assert.equal(parseInt(r), flatsize);
            log(r);
        };
        it("sync", function () {
            test(Augur.getVSize(branch, period));
        });
        it("async", function (done) {
            Augur.getVSize(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getReportsFilled", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getReportsFilled(branch, period));
        });
        it("async", function (done) {
            Augur.getReportsFilled(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getReportsMask", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getReportsMask(branch, period));
        });
        it("async", function (done) {
            Augur.getReportsMask(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getWeightedCenteredData", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getWeightedCenteredData(branch, period));
        });
        it("async", function (done) {
            Augur.getWeightedCenteredData(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getCovarianceMatrixRow", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getCovarianceMatrixRow(branch, period));
        });
        it("async", function (done) {
            Augur.getCovarianceMatrixRow(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getDeflated", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getDeflated(branch, period));
        });
        it("async", function (done) {
            Augur.getDeflated(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getLoadingVector", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getLoadingVector(branch, period));
        });
        it("async", function (done) {
            Augur.getLoadingVector(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getLatent", function () {
        var test = function (r) {
            gteq0(r);
            log(r);
        };
        it("sync", function () {
            test(Augur.getLatent(branch, period));
        });
        it("async", function (done) {
            Augur.getLatent(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getScores", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getScores(branch, period));
        });
        it("async", function (done) {
            Augur.getScores(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getSetOne", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getSetOne(branch, period));
        });
        it("async", function (done) {
            Augur.getSetOne(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getSetTwo", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getSetTwo(branch, period));
        });
        it("async", function (done) {
            Augur.getSetTwo(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("returnOld", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.returnOld(branch, period));
        });
        it("async", function (done) {
            Augur.returnOld(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getNewOne", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getNewOne(branch, period));
        });
        it("async", function (done) {
            Augur.getNewOne(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getNewTwo", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getNewTwo(branch, period));
        });
        it("async", function (done) {
            Augur.getNewTwo(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getAdjPrinComp", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getAdjPrinComp(branch, period));
        });
        it("async", function (done) {
            Augur.getAdjPrinComp(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getSmoothRep", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getSmoothRep(branch, period));
        });
        it("async", function (done) {
            Augur.getSmoothRep(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getOutcomesFinal", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getOutcomesFinal(branch, period));
        });
        it("async", function (done) {
            Augur.getOutcomesFinal(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("getTotalReputation", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.getTotalReputation(branch, period));
        });
        it("async", function (done) {
            Augur.getTotalReputation(branch, period, function (r) {
                test(r); done();
            });
        });
    });
    describe("setTotalReputation", function () {
        var test = function (r) {
            log(r);
        };
        it("sync", function () {
            test(Augur.setTotalReputation(branch, period, 10));
        });
        it("async", function (done) {
            Augur.setTotalReputation(branch, period, 10, function (r) {
                test(r); done();
            });
        });
    });
});
