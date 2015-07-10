/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var assert = require("chai").assert;
var _ = require("lodash");
var chalk = require("chalk");
var Augur = require("../augur");
require('it-each')({ testPerIteration: true });

Augur = require("./utilities").setup(Augur, process.argv.slice(2));

var log = console.log;
var TIMEOUT = 120000;
var minValue = 0;
var maxValue = 1;
var numOutcomes = 2;
var num_events = 4;

var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);
var exp_date = Augur.rpc.blockNumber() + 250;

describe("Creating " + num_events + " events and markets", function () {
    var events = [];
    fs.writeFileSync("events.dat", "");
    it.each(_.range(0, num_events), "create event/market %s", ['element'], function (element, next) {
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
                log(chalk.green("    ✓ ") + chalk.gray("event ID: " + r.callReturn));
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
                        log(chalk.green("    ✓ ") + chalk.gray("market ID: " + res.callReturn));
                    },
                    onSuccess: function (res) {
                        if (element < num_events - 1) {
                            fs.appendFile("events.dat", events[0] + "," + r.callReturn + "\n");
                        } else {
                            fs.appendFile("events.dat", events[0] + "," + r.callReturn);
                        }
                        next();
                    },
                    onFailed: function (res) {
                        throw new Error("createMarket failed: " + JSON.stringify(res, null, 2));
                        next();
                    }
                };
                Augur.createMarket(marketObj);
                // next();
            },
            onFailed: function (r) {
                throw new Error(r.message);
                next();
            }
        });
    });
});
