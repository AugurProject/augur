/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;
var log = console.log;

require('it-each')({ testPerIteration: true });

var EXPIRING = false;

describe("functions/createMarket", function () {

    var events = [[
        "Will the Sun turn into a red giant and engulf the Earth by the end of 2015?",
        utils.date_to_block(augur, "1-1-2016")
    ], [
        "Will Rand Paul win the 2016 U.S. Presidential Election?",
        utils.date_to_block(augur, "1-2-2017")
    ], [
        "Will it rain in New York City on November 12, 2016?",
        utils.date_to_block(augur, "11-13-2016")
    ], [
        "Will the Larsen B ice shelf collapse by November 1, 2016?",
        utils.date_to_block(augur, "11-2-2016")
    ]];

    it.each(
        events,
        "create single-event market using createMarket: %s",
        ['element'],
        function (element, next) {
            this.timeout(constants.TIMEOUT*4);

            // create an event
            var branch = augur.branches.dev;
            var description = element[0];
            var expDate = (EXPIRING) ?
                5*blockNumber + Math.round(Math.random() * 1000) : element[1];
            var minValue = 0;
            var maxValue = 1;
            var numOutcomes = 2;
            augur.createEvent({
                branchId: branch,
                description: description,
                expDate: expDate,
                minValue: minValue,
                maxValue: maxValue,
                numOutcomes: numOutcomes,
                onSent: function (r) {
                    assert(r.txHash);
                    assert(r.callReturn);
                },
                onSuccess: function (r) {
                    var eventID = r.callReturn;
                    var creator = augur.getCreator(eventID);
                    if (creator !== augur.coinbase) {
                        log("\n  createEvent.createEvent:", utils.pp(r));
                    }
                    assert.strictEqual(creator, augur.coinbase);
                    assert.strictEqual(augur.getDescription(eventID), description);

                    // incorporate the new event into a market
                    var alpha = "0.0079";
                    var initialLiquidity = 10 + Math.round(Math.random() * 10);
                    var tradingFee = "0.02";
                    var events = [ eventID ];

                    augur.createMarket({
                        branchId: branch,
                        description: description,
                        alpha: alpha,
                        initialLiquidity: initialLiquidity,
                        tradingFee: tradingFee,
                        events: events,
                        onSent: function (res) {
                            assert(res.txHash);
                            assert(res.callReturn);
                        },
                        onSuccess: function (res) {
                            var marketID = res.callReturn;
                            var creator = augur.getCreator(marketID);
                            if (creator !== augur.coinbase) {
                                log("\n  createMarket.createMarket:", utils.pp(res));
                                log("  getMarketInfo:", utils.pp(augur.getMarketInfo(marketID)));
                                log("  description:", utils.pp(augur.getDescription(marketID)));
                            }
                            assert.strictEqual(creator, augur.coinbase);
                            assert.strictEqual(augur.getDescription(marketID), description);

                            augur.getMarketEvents(marketID, function (event_list) {
                                if (!event_list || !event_list.length) {
                                    log("\n  markets.getMarketEvents:", utils.pp(event_list));
                                    log("  getMarketInfo:", utils.pp(augur.getMarketInfo(marketID)));
                                    log("  description:", utils.pp(augur.getDescription(marketID)));
                                }
                                assert(event_list);
                                assert.isArray(event_list);
                                assert.strictEqual(event_list.length, 1);
                                assert.strictEqual(event_list[0], eventID);
                                next();
                            }); // markets.getMarketEvents

                        },
                        onFailed: function (r) {
                            next(r);
                        }
                    }); // createMarket.createMarket
                
                },
                onFailed: function (r) {
                    next(r);
                }
            }); // createEvent.createEvent

        }
    );

});
