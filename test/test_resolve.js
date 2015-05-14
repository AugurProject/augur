/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("assert");
var Augur = require("../augur");
var constants = require("./constants");
require('it-each')({ testPerIteration: true });

Augur.connect();

var log = console.log;
var TIMEOUT = 120000;
var num_components = "2";
var num_iterations = "5";
var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);
var num_events = Augur.getNumberEvents(branch, period);
var num_reports = Augur.getNumberReporters(branch);
var flatsize = num_events * num_reports;
var reputation_vector = [
    Augur.getRepBalance(branch, Augur.coinbase),
    Augur.getRepBalance(branch, constants.chain10101.accounts.tinybike_new)
];
var ballot = new Array(num_events);
var reports = new Array(flatsize);
for (var i = 0; i < num_reports; ++i) {
    ballot = Augur.getReporterBallot(branch, period, Augur.getReporterID(branch, i));
    if (ballot[0] != 0) {
        for (var j = 0; j < num_events; ++j) {
            reports[i*num_events + j] = ballot[j];
        }
    }
}
var scaled = [];
var scaled_min = [];
var scaled_max = [];
for (var i = 0; i < num_events; ++i) {
    scaled.push(0);
    scaled_min.push(1);
    scaled_max.push(2);
}

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

describe("testing consensus/resolve", function () {
    
    it("resolve", function (done) {
        this.timeout(TIMEOUT);
        Augur.resolve(
            reputation_vector,
            Augur.unfix(reports, "string"),
            scaled,
            scaled_max,
            scaled_min,
            num_reports,
            num_events,
            function (r) {
                // send
            },
            function (r) {
                // success
                log("resolve: ", r.callReturn);
                done();
            },
            function (r) {
                // failed
                throw("resolve: " + r);
                done();
            }
        );
    });

    it("redeem_resolve", function (done) {
        this.timeout(TIMEOUT);
        Augur.redeem_resolve(
            branch,
            period,
            num_events,
            num_reports,
            flatsize,
            function (r) {
                // send
            },
            function (r) {
                // success
                log("redeem_resolve: ", r.callReturn);
                done();
            },
            function (r) {
                // failed
                throw("redeem_resolve: " + r);
                done();
            }
        );
    });
});
