/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var assert = require("assert");
var Augur = require("../augur");
var constants = require("./constants");
require('it-each')({ testPerIteration: true });

Augur.connect();

var log = console.log;
var TIMEOUT = 120000;
var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);

// var events = fs.readFileSync('events.dat').toString().split("\n");
// var num_events = events.length;

// log(num_events);

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
    "0x4a0cf714e2c1b785ff2d650320acf63be9eb25c6"
];

describe("data and api/expiringEvents", function () {

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
        log(ballot);
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
                throw("failed: " + r);
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
        log(ballot);
        reputation = Augur.getRepBalance(
            branch,
            reporters[1]
        );
        assert.equal(
            Augur.getReporterID(branch, 1),
            reporters[1]
        );
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
                throw("failed: " + r);
                done();
            }
        );
    });

    it("setReporterBallot: " + reporters[2], function (done) {
        var i, ballot, reputation;
        this.timeout(TIMEOUT);
        ballot = new Array(num_events);
        for (i = 0; i < num_events; ++i) {
            ballot[i] = 0.0;
        }
        // ballot[num_events-1] = 0.0;
        // ballot[num_events-2] = 0.0;
        // ballot[num_events-1] = 1.0;
        // ballot[num_events-2] = 1.0;
        // ballot[num_events-3] = 1.0;
        log(ballot);
        reputation = Augur.getRepBalance(
            branch,
            reporters[2]
        );
        assert.equal(
            Augur.getReporterID(branch, 2),
            reporters[2]
        );
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
                throw("failed: " + r);
                done();
            }
        );
    });
});
