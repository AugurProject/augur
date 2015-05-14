/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var assert = require("assert");
var BigNumber = require("bignumber.js");
var _ = require("lodash");
var Augur = require("../augur");
var constants = require("./constants");
require('it-each')({ testPerIteration: true });

Augur.connect();

var log = console.log;
var TIMEOUT = 120000;
var minValue = 0;
var maxValue = 1;
var numOutcomes = 2;
var num_events = 10;

var branch = Augur.branches.dev;
var vote_period = Augur.getVotePeriod(branch);

describe("creating events for consensus", function () {
    var events = [];
    fs.writeFileSync("events.dat", "");
    it.each(_.range(0, num_events), "creating event %s", ['element'], function (element, next) {
        this.timeout(TIMEOUT);
        var event_description = Math.random().toString(36).substring(4);
        Augur.createEvent({
            branchId: branch,
            description: event_description,
            expDate: Augur.blockNumber() + 25,
            minValue: minValue,
            maxValue: maxValue,
            numOutcomes: numOutcomes,
            onSent: function (r) {

            },
            onSuccess: function (r) {
                fs.appendFile("events.dat", r.id + "\n");
                next();
            },
            onFailed: function (r) {
                log("failed: " + JSON.stringify(r, null, 2));
                next();
            }
        });
    });
});

describe("populating vote period and +50", function () {
    var events = fs.readFileSync('events.dat').toString().split("\n");
    it.each(events, "addEvent: %s", ['element'], function (element, next) {
        if (element !== "" && element !== "\n") {
            Augur.tx.addEvent.send = false;
            assert.equal(Augur.addEvent(branch, parseInt(vote_period), element), "0x01");
            Augur.tx.addEvent.send = true;
            Augur.addEvent(branch, parseInt(vote_period), element);
        }
        next();
    });
    it.each(events, "addEvent (future): %s", ['element'], function (element, next) {
        if (element !== "" && element !== "\n") {
            Augur.tx.addEvent.send = false;
            assert.equal(Augur.addEvent(branch, parseInt(vote_period) + 50, element), "0x01");
            Augur.tx.addEvent.send = true;
            Augur.addEvent(branch, parseInt(vote_period) + 50, element);
        }
        next();
    });
});
