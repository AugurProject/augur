/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var augur = require("../../src");
var constants = require("../../src/constants");
require('it-each')({ testPerIteration: true });

augur = require("../../src/utilities").setup(augur, process.argv.slice(2));

var log = console.log;
var num_components = "2";
var num_iterations = "5";
var branch = augur.branches.dev;
var period = augur.getVotePeriod(branch);
var num_events = augur.getNumberEvents(branch, period);
var num_reports = augur.getNumberReporters(branch);
var flatsize = num_events * num_reports;
var reputation_vector = [
    augur.getRepBalance(branch, augur.coinbase),
    augur.getRepBalance(branch, constants.chain10101.accounts.tinybike_new)
];
var ballot = new Array(num_events);
var reports = new Array(flatsize);
for (var i = 0; i < num_reports; ++i) {
    ballot = augur.getReporterBallot(branch, period, augur.getReporterID(branch, i));
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

describe("testing consensus/resolve", function () {
    
    it("resolve", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.resolve(
            reputation_vector,
            abi.unfix(reports, "string"),
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
                r.name = r.error; throw r;
                done();
            }
        );
    });

    it("redeem_resolve", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.redeem_resolve(
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
                r.name = r.error; throw r;
                done();
            }
        );
    });
});
