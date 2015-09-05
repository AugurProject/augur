/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("chai").assert;
var _ = require("lodash");
var augur = require("../../src");
var constants = require("../../src/constants");
require('it-each')({ testPerIteration: true });

augur = require("../../src/utilities").setup(augur, process.argv.slice(2));

var log = console.log;
var TIMEOUT = 120000;
var num_components = 2;
var num_iterations = 5;
var dispatches = 10 + num_components*(4 + num_iterations);

var branch = augur.branches.dev;
var period = augur.getVotePeriod(branch);
var num_events = augur.getNumberEvents(branch, period);

log("Initial CASH:", augur.getCashBalance(augur.coinbase));
log("Initial REP: ", augur.getRepBalance(branch, augur.coinbase));

describe("Consensus", function () {
    augur.setStep(branch, 0);
    augur.setSubstep(branch, 0);
    describe("calling dispatch " + dispatches + " times", function () {
        it.each(_.range(0, dispatches), "dispatch %s", ['element'], function (element, next) {
            this.timeout(constants.TIMEOUT);
            augur.dispatch({
                branchId: branch,
                onSent: function (r) {

                },
                onSuccess: function (r) {
                    var step = augur.getStep(branch);
                    var substep = augur.getSubstep(branch);
                    log("      - step:   ", step);
                    log("      - substep:", substep);
                    next();
                },
                onFailed: function (r) {
                    r.name = r.error; throw r;
                    next();
                }
            });
        });
    });
});
