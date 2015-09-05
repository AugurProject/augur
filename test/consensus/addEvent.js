/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var assert = require("assert");
var augur = require("../../src");
var constants = require("../../src/constants");
require('it-each')({ testPerIteration: true });

augur = require("../../src/utilities").setup(augur, process.argv.slice(2));

var log = console.log;
var branch = augur.branches.dev;
var period = augur.getVotePeriod(branch);

var eventsMarkets = fs.readFileSync("../../data/events.dat").toString().split("\n");
var events = [];
for (var i = 0; i < eventsMarkets.length; ++i) {
    events.push(eventsMarkets[i].split(',')[0]);
}
var num_events = events.length;

describe("Add " + num_events + " events manually to vote period " + period, function () {

    it.each(events, "addEvent to vote period: %s", ['element'], function (element, next) {
        if (element !== "" && element !== "\n") {
            augur.tx.addEvent.send = false;
            assert.strictEqual(augur.addEvent(branch, parseInt(period), element), "0x01");
            augur.tx.addEvent.send = true;
            augur.addEvent(branch, parseInt(period), element);
        }
        next();
    });

    it.each(events, "addEvent to +50 vote periods: %s", ['element'], function (element, next) {
        if (element !== "" && element !== "\n") {
            augur.tx.addEvent.send = false;
            assert.strictEqual(augur.addEvent(branch, parseInt(period) + 50, element), "0x01");
            augur.tx.addEvent.send = true;
            augur.addEvent(branch, parseInt(period) + 50, element);
        }
        next();
    });
});
