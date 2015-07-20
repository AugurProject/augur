/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("chai").assert;
var _ = require("lodash");
var Augur = require("../src");
require('it-each')({ testPerIteration: true });

Augur = require("../src/utilities").setup(Augur, process.argv.slice(2));

var log = console.log;
var TIMEOUT = 120000;
var num_components = 2;
var num_iterations = 5;
var dispatches = 10 + num_components*(4 + num_iterations);

var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);
var num_events = Augur.getNumberEvents(branch, period);

log("Initial CASH:", Augur.getCashBalance(Augur.coinbase));
log("Initial REP: ", Augur.getRepBalance(branch, Augur.coinbase));

describe("Consensus", function () {
    Augur.setStep(branch, 0);
    Augur.setSubstep(branch, 0);
    describe("calling dispatch " + dispatches + " times", function () {
        it.each(_.range(0, dispatches), "dispatch %s", ['element'], function (element, next) {
            this.timeout(TIMEOUT);
            Augur.dispatch({
                branchId: branch,
                onSent: function (r) {

                },
                onSuccess: function (r) {
                    var step = Augur.getStep(branch);
                    var substep = Augur.getSubstep(branch);
                    log("      - step:   ", step);
                    log("      - substep:", substep);
                    next();
                },
                onFailed: function (r) {
                    log(JSON.stringify(r, null, 2));
                    throw("dispatch failed");
                    next();
                }
            });
        });
    });
});
