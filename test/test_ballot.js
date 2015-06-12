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

var events = fs.readFileSync('events.dat').toString().split("\n");
var num_events = events.length;

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

describe("data and api/expiringEvents", function () {

    // it.each(events, "addEvent to vote period: %s", ['element'], function (element, next) {
    //     if (element !== "" && element !== "\n") {
    //         Augur.tx.addEvent.send = false;
    //         assert.equal(Augur.addEvent(branch, parseInt(period), element), "0x01");
    //         Augur.tx.addEvent.send = true;
    //         Augur.addEvent(branch, parseInt(period), element);
    //     }
    //     next();
    // });

    // it.each(events, "addEvent to +50 vote periods: %s", ['element'], function (element, next) {
    //     if (element !== "" && element !== "\n") {
    //         Augur.tx.addEvent.send = false;
    //         assert.equal(Augur.addEvent(branch, parseInt(period) + 50, element), "0x01");
    //         Augur.tx.addEvent.send = true;
    //         Augur.addEvent(branch, parseInt(period) + 50, element);
    //     }
    //     next();
    // });

    var period = Augur.getVotePeriod(branch);
    var num_events = Augur.getNumberEvents(branch, period);

    it("setReporterBallot: coinbase", function (done) {
        var i, ballot, reputation;
        this.timeout(TIMEOUT);
        ballot = new Array(num_events);
        for (i = 0; i < num_events; ++i) {
            ballot[i] = 2.0;
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

    it("setReporterBallot: secondary", function (done) {
        var i, ballot, reputation;
        this.timeout(TIMEOUT);
        ballot = new Array(num_events);
        for (i = 0; i < num_events-2; ++i) {
            ballot[i] = 1.0;
        }
        ballot[num_events-1] = 0.0;
        ballot[num_events-2] = 0.0;
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
