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

describe("data and api/expiringEvents", function () {

    it.each(events, "addEvent to vote period: %s", ['element'], function (element, next) {
        if (element !== "" && element !== "\n") {
            Augur.tx.addEvent.send = false;
            assert.equal(Augur.addEvent(branch, parseInt(period), element), "0x01");
            Augur.tx.addEvent.send = true;
            Augur.addEvent(branch, parseInt(period), element);
        }
        next();
    });

    it.each(events, "addEvent to +50 vote periods: %s", ['element'], function (element, next) {
        if (element !== "" && element !== "\n") {
            Augur.tx.addEvent.send = false;
            assert.equal(Augur.addEvent(branch, parseInt(period) + 50, element), "0x01");
            Augur.tx.addEvent.send = true;
            Augur.addEvent(branch, parseInt(period) + 50, element);
        }
        next();
    });
});
