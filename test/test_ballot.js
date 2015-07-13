/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var chalk = require("chalk");
var assert = require("chai").assert;
var Augur = require("../src");
var constants = require("../src/constants");
var utilities = require("../src/utilities");
var log = console.log;

require('it-each')({ testPerIteration: true });

Augur = utilities.setup(Augur, process.argv.slice(2));

var TIMEOUT = 120000;
var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);

var reporters = utilities.get_test_accounts(Augur, constants.max_test_accounts);

describe("Set ballots for " + reporters.length + " reporters", function () {

    var period = Augur.getVotePeriod(branch);
    var num_events = Augur.getNumberEvents(branch, period);
    var events = Augur.getEvents(branch, period);

    it("setReporterBallot: " + reporters[0], function (done) {
        var i, ballot, reputation;
        this.timeout(TIMEOUT);
        ballot = new Array(num_events);
        for (i = 0; i < num_events; ++i) {
            ballot[i] = 2.0;
        }
        ballot[num_events-3] = 1.0;
        log("     ", chalk.cyan(JSON.stringify(ballot)));
        reputation = Augur.getRepBalance(branch, reporters[0]);
        assert.equal(Augur.getReporterID(branch, 0), reporters[0]);
        Augur.setReporterBallot(
            branch,
            period,
            reporters[0],
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
                throw r.message;
                done();
            }
        );
    });

    it("setReporterBallot: " + reporters[1], function (done) {
        var i, ballot, reputation;
        this.timeout(TIMEOUT);
        ballot = new Array(num_events);
        for (i = 0; i < num_events; ++i) {
            ballot[i] = 0.0;
            // ballot[i] = 2.0;
        }
        // ballot[num_events-1] = 1.0;
        // ballot[num_events-2] = 1.0;
        // ballot[num_events-3] = 1.0;
        log("     ", chalk.cyan(JSON.stringify(ballot)));
        reputation = Augur.getRepBalance(branch, reporters[1]);
        assert.equal(Augur.getReporterID(branch, 1), reporters[1]);
        Augur.setReporterBallot(
            branch,
            period,
            reporters[1],
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
                throw r.message;
                done();
            }
        );
    });

    it("setReporterBallot: " + reporters[2], function (done) {
        var i, ballot, reputation;
        this.timeout(TIMEOUT);
        ballot = new Array(num_events);
        for (i = 0; i < num_events; ++i) {
            ballot[i] = 2.0;
        }
        // ballot[num_events-1] = 0.0;
        // ballot[num_events-2] = 0.0;
        ballot[num_events-1] = 1.0;
        ballot[num_events-2] = 1.0;
        ballot[num_events-3] = 1.0;
        log("     ", chalk.cyan(JSON.stringify(ballot)));
        reputation = Augur.getRepBalance(branch, reporters[2]);
        assert.equal(Augur.getReporterID(branch, 2), reporters[2]);
        Augur.setReporterBallot(
            branch,
            period,
            reporters[2],
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
                throw r.message;
                done();
            }
        );
    });

    it.each(reporters.slice(3), "setReporterBallot: %s", ['element'], function (element, next) {
        var i, ballot, reputation;
        this.timeout(TIMEOUT);
        ballot = new Array(num_events);
        for (i = 0; i < num_events; ++i) {
            ballot[i] = 0.0;
        }
        log("     ", chalk.cyan(JSON.stringify(ballot)));
        reputation = Augur.getRepBalance(branch, element);
        Augur.setReporterBallot(
            branch,
            period,
            element,
            ballot,
            reputation,
            function (r) {
                // sent
            },
            function (r) {
                // success
                assert.equal(r.callReturn, "0x01");
                next();
            },
            function (r) {
                // failed
                throw r.message;
                next();
            }
        );
    });
});
