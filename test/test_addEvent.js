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
var path = require("path");
var args = process.argv.slice(2);
if (args.length && (args[0] === "--gospel" || args[0] === "--reset" || args[0] === "--postupload" || args[0] === "--faucets" || args[0] === "--ballots")) {
    var gospel = path.join(__dirname, "gospel.json");
    Augur.contracts = JSON.parse(fs.readFileSync(gospel));
}
Augur.connect();

var log = console.log;
var TIMEOUT = 120000;
var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);

var eventsMarkets = fs.readFileSync('events.dat').toString().split("\n");
var events = [];
for (var i = 0; i < eventsMarkets.length; ++i) {
    events.push(eventsMarkets[i].split(',')[0]);
}
var num_events = events.length;

describe("Add " + num_events + " events manually to vote period " + period, function () {

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
