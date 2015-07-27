/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var constants = require("../src/constants");
var utilities = require("../src/utilities");
var Augur = utilities.setup(require("../src"), process.argv.slice(2));
var log = console.log;

require('it-each')({ testPerIteration: true });

var EXPIRING = false;
var events = [
    ["Will the Sun turn into a red giant and engulf the Earth by the end of 2015?", utilities.date_to_block(Augur, "1-1-2016")],
    ["Will Rand Paul win the 2016 U.S. Presidential Election?", utilities.date_to_block(Augur, "1-2-2017")],
    ["Will it rain in New York City on November 12, 2015?", utilities.date_to_block(Augur, "11-13-2015")],
    ["Will the Larsen B ice shelf collapse by November 1, 2015?", utilities.date_to_block(Augur, "11-2-2015")]
];

describe("functions/createMarket", function () {
    it.each(events, "single-event market: %s", ['element'], function (element, next) {
        this.timeout(constants.TIMEOUT*4);
        var event_description = element[0];
        var blockNumber = Augur.blockNumber();
        var expDate = (EXPIRING) ? blockNumber + Math.round(Math.random() * 1000) : element[1];
        var minValue = 0;
        var maxValue = 1;
        var numOutcomes = 2;
        var eventObj = {
            branchId: Augur.branches.dev,
            description: event_description,
            expDate: expDate,
            minValue: minValue,
            maxValue: maxValue,
            numOutcomes: numOutcomes,
            onSent: function (r) {
                // log("createEvent sent: " + JSON.stringify(r, null, 2));
            },
            onSuccess: function (r) {
                // log("createEvent success: " + JSON.stringify(r, null, 2));
                var alpha = "0.0079";
                var initialLiquidity = 1000 + Math.round(Math.random() * 1000);
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
                    },
                    onSuccess: function (res) {
                        // log("createMarket success: " + JSON.stringify(res, null, 2));
                        // assert.equal(res.numOutcomes, numOutcomes);
                        // assert.equal(parseFloat(res.alpha).toFixed(5), parseFloat(alpha).toFixed(5));
                        // assert.equal(res.numOutcomes, numOutcomes);
                        // assert.equal(parseFloat(res.tradingFee).toFixed(5), parseFloat(tradingFee).toFixed(5));
                        // assert.equal(res.description, market_description);
                        // log("description: ", res.description);
                        next();
                    },
                    onFailed: function (r) {
                        r.name = r.error;
                        throw r;
                        next();
                    }
                };
                Augur.createMarket(marketObj);
            },
            onFailed: function (r) {
                r.name = r.error;
                throw r;
                next();
            }
        };
        Augur.createEvent(eventObj);
    });
});
