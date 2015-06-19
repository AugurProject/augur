/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var assert = require("chai").assert;
var Augur = require("../augur");
var chalk = require("chalk");
var constants = require("./constants");
require('it-each')({ testPerIteration: true });

Augur.connect();

var log = console.log;
var TIMEOUT = 120000;
var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);

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

var reporters = [
    "0x639b41c4d3d399894f2a57894278e1653e7cd24c",
    "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
    "0x4a0cf714e2c1b785ff2d650320acf63be9eb25c6",
    "0x72caf0651be1bb05eff6d21b005db49654784aee",
    "0x0da70d5a92d6cfcd4c12e2a83950676fdf4c95f9",
    "0x676fe049c8f1440a8e3ec1832806b43ae128059f",
    "0x405be667f1a6b2d5149a61057040cade5aada366",
    "0x9a5ab02a8b31d1ccd632936574a14f77788dfe6d",
    "0xebb117ef11769e675e0245062a8e6296dfe42da4",
    "0x2a7e417ff20606e384526ed42d306943caec2d24",
    "0xf0c4ee355432a7c7da12bdef04543723d110d591",
    "0xef2b2ba637921b8cf51b8a89576666a5d4322c69",
    "0x2c97f31d2db40aa57d0e6ca5fa8aedf7d99592db",
    "0xcdc2cdaab90909769ccf823246f04f0da827a732",
    "0xa78ddbe112cb29844d2a26cbc4e52c11e74aaa6c"
];

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
        log("   ", chalk.cyan(JSON.stringify(ballot)));
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
        log("   ", chalk.cyan(JSON.stringify(ballot)));
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
        log("   ", chalk.cyan(JSON.stringify(ballot)));
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
        log("   ", chalk.cyan(JSON.stringify(ballot)));
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
