/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augurpath = "../../src/index";
var augur = require(augurpath);

require('it-each')({ testPerIteration: true });

var EXPIRING = false;

if (!process.env.CONTINUOUS_INTEGRATION) {

    describe("createMarket", function () {

        beforeEach(function () {
            augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
        });

        describe("binary", function () {
            var events = [[
                "Will the Sun turn into a red giant and engulf the Earth by the end of 2016?",
                utils.date_to_block(augur, "1-1-2017")
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
                    this.timeout(augur.constants.TIMEOUT*4);

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
                                console.log("\n  createEvent.createEvent:", utils.pp(r));
                            }
                            assert.strictEqual(creator, augur.coinbase);
                            assert.strictEqual(augur.getDescription(eventID), description);

                            // incorporate the new event into a market
                            var alpha = "0.0079";
                            var initialLiquidity = 10 + Math.round(Math.random() * 10);
                            var tradingFee = "0.02";
                            var events = [eventID];

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
                                        console.log("\n  createMarket.createMarket:", utils.pp(res));
                                        console.log("  getMarketInfo:", utils.pp(augur.getMarketInfo(marketID)));
                                        console.log("  description:", utils.pp(augur.getDescription(marketID)));
                                    }
                                    assert.strictEqual(creator, augur.coinbase);
                                    assert.strictEqual(augur.getDescription(marketID), description);

                                    augur.getMarketEvents(marketID, function (eventList) {
                                        if (!eventList || !eventList.length) {
                                            console.log("\n  markets.getMarketEvents:", utils.pp(eventList));
                                            console.log("  getMarketInfo:", utils.pp(augur.getMarketInfo(marketID)));
                                            console.log("  description:", utils.pp(augur.getDescription(marketID)));
                                            next(new Error("event list"));
                                        }
                                        assert(eventList);
                                        assert.isArray(eventList);
                                        assert.strictEqual(eventList.length, 1);
                                        assert.strictEqual(eventList[0], eventID);
                                        next();
                                    }); // markets.getMarketEvents

                                },
                                onFailed: next
                            }); // createMarket.createMarket

                        },
                        onFailed: next
                    }); // createEvent.createEvent
                }
            );
        });

        describe("categorical", function () {

            var test = function (t) {
                it(t.numOutcomes + " outcomes on [" + t.minValue + ", " + t.maxValue + "]", function (done) {
                    this.timeout(augur.constants.TIMEOUT*4);
                    augur.createEvent({
                        branchId: t.branch,
                        description: t.description,
                        expDate: t.expirationBlock,
                        minValue: t.minValue,
                        maxValue: t.maxValue,
                        numOutcomes: t.numOutcomes,
                        onSent: function (r) {
                            assert(r.txHash);
                            assert(r.callReturn);
                        },
                        onSuccess: function (r) {
                            var eventID = r.callReturn;
                            assert.strictEqual(augur.getCreator(eventID), augur.coinbase);
                            assert.strictEqual(augur.getDescription(eventID), t.description);
                            var initialLiquidity = t.initialLiquidityFloor + Math.round(Math.random() * 10);
                            var events = [eventID];
                            augur.createMarket({
                                branchId: t.branch,
                                description: t.description,
                                alpha: t.alpha,
                                initialLiquidity: initialLiquidity,
                                tradingFee: t.tradingFee,
                                events: events,
                                onSent: function (res) {
                                    assert(res.txHash);
                                    assert(res.callReturn);
                                },
                                onSuccess: function (res) {
                                    var marketID = res.callReturn;
                                    assert.strictEqual(augur.getCreator(marketID), augur.coinbase);
                                    assert.strictEqual(augur.getDescription(marketID), t.description);
                                    augur.getMarketEvents(marketID, function (eventList) {
                                        assert.isArray(eventList);
                                        assert.strictEqual(eventList.length, 1);
                                        assert.strictEqual(eventList[0], eventID);
                                        done();
                                    }); // markets.getMarketEvents
                                },
                                onFailed: done
                            }); // createMarket.createMarket

                        },
                        onFailed: done
                    }); // createEvent.createEvent
                });
            };

            test({
                branch: augur.branches.dev,
                description: "Will the average temperature on Earth in 2016 be Higher, Lower, or Unchanged from the average temperature on Earth in 2015?",
                expirationBlock: utils.date_to_block(augur, "1-1-2017"),
                minValue: 0,
                maxValue: 1,
                numOutcomes: 3,
                alpha: "0.079",
                tradingFee: "0.02",
                initialLiquidityFloor: 10
            });
            test({
                branch: augur.branches.dev,
                description: "Will Microsoft's stock price at 12:00 UTC on July 1, 2016 be Higher, Lower, or Equal to $54.13?",
                expirationBlock: utils.date_to_block(augur, "1-1-2017"),
                minValue: 10,
                maxValue: 20,
                numOutcomes: 3,
                alpha: "0.079",
                tradingFee: "0.02",
                initialLiquidityFloor: 10
            });
            test({
                branch: augur.branches.dev,
                description: "Who will win the 2016 U.S. Presidential Election: Hillary Clinton, Donald Trump, Bernie Sanders, or someone else?",
                expirationBlock: utils.date_to_block(augur, "1-3-2017"),
                minValue: 0,
                maxValue: 1,
                numOutcomes: 4,
                alpha: "0.079",
                tradingFee: "0.02",
                initialLiquidityFloor: 10
            });
            test({
                branch: augur.branches.dev,
                description: "Which political party's candidate will win the 2016 U.S. Presidential Election: Democratic, Republican, Libertarian, or other?",
                expirationBlock: utils.date_to_block(augur, "1-3-2017"),
                minValue: 10,
                maxValue: 20,
                numOutcomes: 4,
                alpha: "0.079",
                tradingFee: "0.02",
                initialLiquidityFloor: 10
            });
            test({
                branch: augur.branches.dev,
                description: "Which city will have the highest median single-family home price for September 2016: London, New York, Los Angeles, San Francisco, Tokyo, Palo Alto, Hong Kong, Paris, or other?",
                expirationBlock: utils.date_to_block(augur, "10-1-2016"),
                minValue: 0,
                maxValue: 1,
                numOutcomes: 9,
                alpha: "0.079",
                tradingFee: "0.01",
                initialLiquidityFloor: 25
            });
        });

        describe("scalar", function () {
            var test = function (t) {
                it("[" + t.minValue + ", " + t.maxValue + "]", function (done) {
                    this.timeout(augur.constants.TIMEOUT*4);
                    augur.createEvent({
                        branchId: t.branch,
                        description: t.description,
                        expDate: t.expirationBlock,
                        minValue: t.minValue,
                        maxValue: t.maxValue,
                        numOutcomes: t.numOutcomes,
                        onSent: function (r) {
                            assert(r.txHash);
                            assert(r.callReturn);
                        },
                        onSuccess: function (r) {
                            var eventID = r.callReturn;
                            assert.strictEqual(augur.getCreator(eventID), augur.coinbase);
                            assert.strictEqual(augur.getDescription(eventID), t.description);
                            var initialLiquidity = t.initialLiquidityFloor + Math.round(Math.random() * 10);
                            var events = [eventID];
                            augur.createMarket({
                                branchId: t.branch,
                                description: t.description,
                                alpha: t.alpha,
                                initialLiquidity: initialLiquidity,
                                tradingFee: t.tradingFee,
                                events: events,
                                onSent: function (res) {
                                    assert(res.txHash);
                                    assert(res.callReturn);
                                },
                                onSuccess: function (res) {
                                    var marketID = res.callReturn;
                                    assert.strictEqual(augur.getCreator(marketID), augur.coinbase);
                                    assert.strictEqual(augur.getDescription(marketID), t.description);
                                    augur.getMarketEvents(marketID, function (eventList) {
                                        assert.isArray(eventList);
                                        assert.strictEqual(eventList.length, 1);
                                        assert.strictEqual(eventList[0], eventID);
                                        done();
                                    }); // markets.getMarketEvents
                                },
                                onFailed: done
                            }); // createMarket.createMarket

                        },
                        onFailed: done
                    }); // createEvent.createEvent
                });
            };

            // scalar markets have numOutcomes==2 and maxValue!=1
            test({
                branch: augur.branches.dev,
                description: "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?",
                expirationBlock: utils.date_to_block(augur, "7-2-2016"),
                minValue: 0,
                maxValue: 120,
                numOutcomes: 2,
                alpha: "0.079",
                tradingFee: "0.02",
                initialLiquidityFloor: 10
            });
        });
    });
}
