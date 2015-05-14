/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("assert");
var _ = require("lodash");
var Augur = require("../augur");
var constants = require("./constants");
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
var num_reports = Augur.getNumberReporters(branch);
var flatsize = num_events * num_reports;

// var ballot = new Array(num_events);
// for (var i = 0; i < num_events; ++i) {
//     ballot[i] = Math.random();
//     if (ballot[i] > 0.6) {
//         ballot[i] = 2.0;
//     } else if (ballot[i] >= 0.4) {
//         ballot[i] = 1.5;
//     } else {
//         ballot[i] = 1.0;
//     }
// }

describe("set reporter ballots", function () {

    it("set coinbase report", function (done) {
        var i, ballot, reputation;
        this.timeout(TIMEOUT);
        ballot = new Array(num_events);
        for (i = 0; i < num_events; ++i) {
            ballot[i] = Math.random();
            if (ballot[i] > 0.6) {
                ballot[i] = 2.0;
            } else if (ballot[i] >= 0.4) {
                ballot[i] = 1.5;
            } else {
                ballot[i] = 1.0;
            }
        }
        log(ballot);
        reputation = Augur.getRepBalance(branch, Augur.coinbase);
        assert.equal(Augur.getReporterID(branch, 0), Augur.coinbase);
        Augur.setReporterBallot(
            branch,
            period,
            Augur.coinbase,
            ballot,
            reputation,
            function (r) {
                // sent
            },
            function (r) {
                // success
                assert.equal(r.callReturn, "0x01");
                done();
            },
            function (r) {
                // failed
                throw("failed: " + r);
                done();
            }
        );
    });

    it("set secondary report", function (done) {
        var i, ballot, reputation;
        this.timeout(TIMEOUT);
        ballot = new Array(num_events);
        for (i = 0; i < num_events; ++i) {
            ballot[i] = Math.random();
            if (ballot[i] > 0.6) {
                ballot[i] = 2.0;
            } else if (ballot[i] >= 0.4) {
                ballot[i] = 1.5;
            } else {
                ballot[i] = 1.0;
            }
        }
        log(ballot);
        reputation = Augur.getRepBalance(
            branch,
            constants.chain10101.accounts.tinybike_new
        );
        assert.equal(
            Augur.getReporterID(branch, 1),
            constants.chain10101.accounts.tinybike_new
        );
        Augur.setReporterBallot(
            branch,
            period,
            constants.chain10101.accounts.tinybike_new,
            ballot,
            reputation,
            function (r) {
                // sent
            },
            function (r) {
                // success
                assert.equal(r.callReturn, "0x01");
                done();
            },
            function (r) {
                // failed
                throw("failed: " + r);
                done();
            }
        );
    });
});

describe("testing consensus/dispatch", function () {
    it.each(_.range(0, dispatches), "dispatch %s", ['element'], function (element, next) {
        this.timeout(TIMEOUT);
        Augur.dispatch({
            branchId: branch,
            onSent: function (r) {
                // log("dispatch", r.step);
            },
            onSuccess: function (r) {
                // log("dispatch", r);
                log("    - step:   ", Augur.getStep(branch));
                log("    - substep:", Augur.getSubstep(branch));
                next();
            },
            onFailed: function (r) {
                log(r);
                throw("dispatch failed: " + r);
                next();
            }
        });
    });
});
