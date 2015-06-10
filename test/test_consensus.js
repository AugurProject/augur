/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var assert = require("assert");
var _ = require("lodash");
var Augur = require("../augur");
require('it-each')({ testPerIteration: true });

Augur.connect();

var log = console.log;
var TIMEOUT = 120000;
var num_components = 2;
var num_iterations = 5;
var dispatches = 9 + num_components*(4 + num_iterations);

var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);
var num_events = Augur.getNumberEvents(branch, period);

describe("Consensus", function () {
    describe("calling dispatch " + dispatches + " times", function () {
        it.each(_.range(0, dispatches), "dispatch %s", ['element'], function (element, next) {
            this.timeout(TIMEOUT);
            Augur.dispatch({
                branchId: branch,
                onSent: function (r) {
                    // log("dispatch", r.callReturn);
                },
                onSuccess: function (r) {
                    // log("dispatch", r);
                    log("    - step:   ", Augur.getStep(branch));
                    log("    - substep:", Augur.getSubstep(branch));
                    next();
                },
                onFailed: function (r) {
                    throw("dispatch failed: " + JSON.stringify(r, null, 2));
                    next();
                }
            });
        });
    });
});
