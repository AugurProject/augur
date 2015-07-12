#!/usr/bin/env node

"use strict";

var assert = require("chai").assert;
var constants = require("./constants");
var utilities = require("../utilities");
var Augur = utilities.setup(require("../augur"), process.argv.slice(2));
var log = console.log;

var branch = Augur.branches.dev;
var period = Augur.abi.bignum(Augur.getVotePeriod(branch)).toNumber() - 1;
var num_reports = Augur.getNumberReporters(branch);
var num_events = Augur.getNumberEvents(branch, period);
var flatsize = num_events * num_reports;

var reporters = utilities.get_test_accounts(Augur, constants.max_test_accounts);
var ballots = new Array(flatsize);
for (var i = 0; i < num_reports; ++i) {
    var reporterID = Augur.getReporterID(branch, i);
    var ballot = Augur.getReporterBallot(branch, period, reporterID).slice(0, num_events);
    if (ballot[0] != 0) {
        for (var j = 0; j < num_events; ++j) {
            ballots[i*num_events + j] = ballot[j];
        }
    } else {
        for (var j = 0; j < num_events; ++j) {
            ballots[i*num_events + j] = '0';
        }
    }
}
log("Ballots:");
log(utilities.fold(ballots, num_events));

log("\nCentered:");
var wcd = utilities.fold(Augur.getWeightedCenteredData(branch, period).slice(0, flatsize), num_events);
log(wcd);

log("\nInterpolated:");
var reports_filled = utilities.fold(Augur.getReportsFilled(branch, period).slice(0, flatsize), num_events);
log(reports_filled);

var outcomes = Augur.getOutcomesFinal(branch, period).slice(0, num_events);
log("\nOutcomes:");
log(outcomes);

var smooth_rep = Augur.getSmoothRep(branch, period).slice(0, num_reports);
log("\nSmoothed reputation fraction:");
log(smooth_rep);

var reporter_payouts = Augur.getReporterPayouts(branch, period).slice(0, num_reports);
log("\nReporter payouts:");
log(reporter_payouts);

var reputation = [];
var total_rep = 0;
for (var i = 0, len = reporters.length; i < len; ++i) {
    reputation.push(Augur.getRepBalance(branch, reporters[i]));
    total_rep += Number(Augur.getRepBalance(branch, reporters[i]));
}
log("\nUpdated reputation:");
log(reputation);

log("\nTotal reputation (" + (47*reporters.length).toString() + " expected): " + total_rep.toString());
assert.equal(total_rep, 47*reporters.length);
