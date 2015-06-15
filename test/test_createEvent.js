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
var num_events = 5;

var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);
var exp_date = Augur.blockNumber() + 100;

describe("functions/createEvent", function () {
    var events = [];
    fs.writeFileSync("events.dat", "");
    it.each(_.range(0, num_events), "creating event %s", ['element'], function (element, next) {
        this.timeout(TIMEOUT);
        var event_description = Math.random().toString(36).substring(4);
        Augur.createEvent({
            branchId: branch,
            description: event_description,
            expDate: exp_date,
            minValue: minValue,
            maxValue: maxValue,
            numOutcomes: numOutcomes,
            onSent: function (r) {
                log("    - event ID: " + r.callReturn);
            },
            onSuccess: function (r) {
                var alpha = "0.0079";
                var initialLiquidity = 1000;
                var tradingFee = "0.02";
                var events = [ r.callReturn ];
                var market_description = event_description;
                var numOutcomes = 2;
                var marketObj = {
                    branchId: Augur.branches.dev,
                    description: market_description,
                    alpha: alpha,
                    initialLiquidity: initialLiquidity,
                    tradingFee: tradingFee,
                    events: events,
                    onSent: function (res) {
                        // log("createMarket sent: " + JSON.stringify(res, null, 2));
                        log("    - market ID: " + res.callReturn);
                    },
                    onSuccess: function (res) {
                        // log("createMarket success: " + JSON.stringify(res, null, 2));
                        if (element < num_events - 1) {
                            fs.appendFile("events.dat", events[0] + "," + r.callReturn + "\n");
                        } else {
                            fs.appendFile("events.dat", events[0] + "," + r.callReturn);
                        }
                        next();
                    },
                    onFailed: function (res) {
                        log("createMarket failed: " + JSON.stringify(res, null, 2));
                        next();
                    }
                };
                Augur.createMarket(marketObj);
            },
            onFailed: function (r) {
                log("failed: " + JSON.stringify(r, null, 2));
                next();
            }
        });
    });
});
