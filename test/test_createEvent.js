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
var minValue = 0;
var maxValue = 1;
var numOutcomes = 2;
var num_events = 10;

var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);

describe("functions/createEvent", function () {
    var events = [];
    fs.writeFileSync("events.dat", "");
    it.each(_.range(0, num_events), "creating event %s", ['element'], function (element, next) {
        this.timeout(TIMEOUT);
        var event_description = Math.random().toString(36).substring(4);
        Augur.createEvent({
            branchId: branch,
            description: event_description,
            expDate: Augur.blockNumber(),
            minValue: minValue,
            maxValue: maxValue,
            numOutcomes: numOutcomes,
            onSent: function (r) {
                // log(r);
            },
            onSuccess: function (r) {
                // log(r);
                if (element < num_events - 1) {
                    fs.appendFile("events.dat", r.callReturn + "\n");
                } else {
                    fs.appendFile("events.dat", r.callReturn);
                }
                next();
            },
            onFailed: function (r) {
                log("failed: " + JSON.stringify(r, null, 2));
                next();
            }
        });
    });
});
