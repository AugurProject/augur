#!/usr/bin/env node

"use strict";

var Augur = require("../augur");
var constants = require("./constants");

Augur.connect();

var log = console.log;

var branch = Augur.branches.dev;
var period = parseInt(Augur.getVotePeriod(branch)) - 1;
var num_reports = Augur.getNumberReporters(branch);
var num_events = Augur.getNumberEvents(branch, period);
var flatsize = num_events * num_reports;

var reporters = [
    Augur.coinbase,
    constants.chain10101.accounts.tinybike_new
];
var ballots = [];
for (var i = 0, len = reporters.length; i < len; ++i) {
    ballots.push(
        Augur.getReporterBallot(branch, period, reporters[i]
    ).slice(0, num_events));
}
log("Ballots:");
log(ballots);

log("\nCentered:");
var wcd = Augur.fold(Augur.getWeightedCenteredData(branch, period).slice(0, flatsize), num_events);

log("\nInterpolated:");
var reports_filled = Augur.fold(Augur.getReportsFilled(branch, period).slice(0, flatsize), num_events);
log(reports_filled);

var outcomes = Augur.getOutcomesFinal(branch, period).slice(0, num_events);
log("\nOutcomes:");
log(outcomes);

var scores = Augur.getScores(branch, period).slice(0, num_reports);
log("\nScores:");
log(scores);

var smooth_rep = Augur.getSmoothRep(branch, period).slice(0, num_reports);
log("\nUpdated reputation fraction:");
log(smooth_rep);

var reputation = [];
for (i = 0, len = reporters.length; i < len; ++i) {
    reputation.push(Augur.getRepBalance(reporters[i]));
}
log("\nUpdated reputation:");
log(reputation);
