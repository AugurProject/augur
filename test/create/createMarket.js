/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var async = require("async");
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

        describe("categorical", function () {

            var test = function (t) {
                it(t.numOutcomes + " outcomes on [" + t.minValue + ", " + t.maxValue + "]", function (done) {
                    this.timeout(augur.constants.TIMEOUT*2);
                    augur.createEvent({
                        branchId: t.branch,
                        description: t.description,
                        expirationBlock: t.expirationBlock,
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
                                        augur.getMarketInfo(marketID, function (info) {
                                            if (info.error) return done(info);
                                            assert.isArray(info.events);
                                            assert.strictEqual(info.events.length, 1);
                                            assert.strictEqual(info.events[0].type, "categorical");
                                            assert.strictEqual(info.type, "categorical");
                                            done();
                                        });
                                    }); // markets.getMarketEvents
                                },
                                onFailed: function (err) {
                                    done(new Error(utils.pp(err)));
                                }
                            }); // createMarket.createMarket

                        },
                        onFailed: function (err) {
                            done(new Error(utils.pp(err)));
                        }
                    }); // createEvent.createEvent
                });
            };

            test({
                branch: augur.branches.dev,
                description: "Will the average temperature on Earth in 2016 be Higher, Lower, or Unchanged from the average temperature on Earth in 2015? Choices: Higher, Lower, Unchanged",
                expirationBlock: utils.date_to_block(augur, "1-1-2017"),
                minValue: 1,
                maxValue: 2,
                numOutcomes: 3,
                alpha: "0.0079",
                tradingFee: "0.02",
                initialLiquidityFloor: 50
            });
            test({
                branch: augur.branches.dev,
                description: "Will Microsoft's stock price at 12:00 UTC on July 1, 2016 be Higher, Lower, or Equal to $54.13? Choices: Higher, Lower, Equal",
                expirationBlock: utils.date_to_block(augur, "1-1-2017"),
                minValue: 10,
                maxValue: 20,
                numOutcomes: 3,
                alpha: "0.0079",
                tradingFee: "0.02",
                initialLiquidityFloor: 50
            });
            test({
                branch: augur.branches.dev,
                description: "Who will win the 2016 U.S. Presidential Election? Choices: Hillary Clinton, Donald Trump, Bernie Sanders, someone else",
                expirationBlock: utils.date_to_block(augur, "1-3-2017"),
                minValue: 0,
                maxValue: 1,
                numOutcomes: 4,
                alpha: "0.0079",
                tradingFee: "0.02",
                initialLiquidityFloor: 50
            });
            test({
                branch: augur.branches.dev,
                description: "Which political party's candidate will win the 2016 U.S. Presidential Election? Choices: Democratic, Republican, Libertarian, other",
                expirationBlock: utils.date_to_block(augur, "1-3-2017"),
                minValue: 10,
                maxValue: 20,
                numOutcomes: 4,
                alpha: "0.0079",
                tradingFee: "0.02",
                initialLiquidityFloor: 50
            });
            test({
                branch: augur.branches.dev,
                description: "Which city will have the highest median single-family home price for September 2016? Choices: London, New York, Los Angeles, San Francisco, Tokyo, Palo Alto, Hong Kong, Paris, other",
                expirationBlock: utils.date_to_block(augur, "10-1-2016"),
                minValue: 0,
                maxValue: 1,
                numOutcomes: 9,
                alpha: "0.0079",
                tradingFee: "0.03",
                initialLiquidityFloor: 75
            });
        });

        describe("scalar", function () {
            var test = function (t) {
                it("[" + t.minValue + ", " + t.maxValue + "]", function (done) {
                    this.timeout(augur.constants.TIMEOUT*2);
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
                                    augur.getMarketInfo(marketID);
                                    assert.strictEqual(augur.getCreator(marketID), augur.coinbase);
                                    assert.strictEqual(augur.getDescription(marketID), t.description);
                                    augur.getMarketEvents(marketID, function (eventList) {
                                        assert.isArray(eventList);
                                        assert.strictEqual(eventList.length, 1);
                                        assert.strictEqual(eventList[0], eventID);
                                        augur.getMarketInfo(marketID, function (info) {
                                            if (info.error) return done(info);
                                            assert.isArray(info.events);
                                            assert.strictEqual(info.events.length, 1);
                                            assert.strictEqual(info.events[0].type, "scalar");
                                            assert.strictEqual(info.type, "scalar");
                                            done();
                                        });
                                    }); // markets.getMarketEvents
                                },
                                onFailed: function (err) {
                                    done(new Error(utils.pp(err)));
                                }
                            }); // createMarket.createMarket

                        },
                        onFailed: function (err) {
                            done(new Error(utils.pp(err)));
                        }
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
                alpha: "0.0079",
                tradingFee: "0.02",
                initialLiquidityFloor: 75
            });
            test({
                branch: augur.branches.dev,
                description: "How much will it cost (in USD) to move a pound of inert cargo from Earth's surface to Low Earth Orbit by January 1, 2020?",
                expirationBlock: utils.date_to_block(augur, "1-2-2020"),
                minValue: 1,
                maxValue: 15000,
                numOutcomes: 2,
                alpha: "0.0079",
                tradingFee: "0.035",
                initialLiquidityFloor: 50
            });
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
            it.each(events, "%s", ["element"], function (element, next) {
                this.timeout(augur.constants.TIMEOUT*2);

                // create an event
                var branch = augur.branches.dev;
                var description = element[0];
                var expDate = (EXPIRING) ?
                    5*blockNumber + Math.round(Math.random() * 1000) : element[1];
                var minValue = 1;
                var maxValue = 2;
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
                        var initialLiquidity = 50 + Math.round(Math.random() * 10);
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
                                    augur.getMarketInfo(marketID, function (info) {
                                        if (info.error) return next(info);
                                        assert.isArray(info.events);
                                        assert.strictEqual(info.events.length, 1);
                                        assert.strictEqual(info.events[0].type, "binary");
                                        assert.strictEqual(info.type, "binary");
                                        next();
                                    });
                                }); // markets.getMarketEvents

                            },
                            onFailed: next
                        }); // createMarket.createMarket

                    },
                    onFailed: next
                }); // createEvent.createEvent
            });
        });

        describe("combinatorial", function () {

            var test = function (t) {
                it(t.numEvents + "-event market", function (done) {
                    this.timeout(augur.constants.TIMEOUT*8);
                    var events = [];
                    async.eachSeries(t.events, function (event, nextEvent) {
                        augur.createEvent({
                            branchId: t.branch,
                            description: event.description,
                            expDate: event.expirationBlock,
                            minValue: event.minValue,
                            maxValue: event.maxValue,
                            numOutcomes: event.numOutcomes,
                            onSent: function (r) {
                                assert(r.txHash);
                                assert(r.callReturn);
                            },
                            onSuccess: function (r) {
                                var eventID = r.callReturn;
                                assert.strictEqual(augur.getCreator(eventID), augur.coinbase);
                                assert.strictEqual(augur.getDescription(eventID), event.description);
                                events.push(eventID);
                                nextEvent();
                            },
                            onFailed: nextEvent
                        });
                    }, function (err) {
                        if (err) return done(err);
                        var initialLiquidity = t.initialLiquidityFloor + Math.round(Math.random() * 10);
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
                                assert.strictEqual(t.numEvents, parseInt(augur.getNumEvents(marketID)));
                                augur.getMarketEvents(marketID, function (eventList) {
                                    assert.isArray(eventList);
                                    assert.strictEqual(eventList.length, t.numEvents);
                                    for (var i = 0, len = eventList.length; i < len; ++i) {
                                        assert.strictEqual(eventList[i], events[i]);
                                    }
                                    augur.getMarketInfo(marketID, function (info) {
                                        assert.notProperty(info, "error");
                                        assert.isArray(info.events);
                                        assert.strictEqual(info.events.length, t.numEvents);
                                        for (var i = 0, len = info.events.length; i < len; ++i) {
                                            assert.strictEqual(info.events[i].type, t.events[i].type);
                                        }
                                        assert.strictEqual(info.type, "combinatorial");
                                        done();
                                    });
                                });
                            },
                            onFailed: function (err) {
                                done(new Error(utils.pp(err)));
                            }
                        });
                    });
                });
            };

            test({
                branch: augur.branches.dev,
                numEvents: 2,
                events: [{
                    type: "scalar",
                    description: "How many marine species will go extinct between January 1, 2016 and January 1, 2018?",
                    expirationBlock: utils.date_to_block(augur, "1-2-2018"),
                    minValue: 0,
                    maxValue: 1000000,
                    numOutcomes: 2
                }, {
                    type: "scalar",
                    description: "What will the average tropospheric methane concentration (in parts-per-billion) be between January 1, 2017 and January 1, 2018?",
                    expirationBlock: utils.date_to_block(augur, "1-2-2018"),
                    minValue: 700,
                    maxValue: 5000,
                    numOutcomes: 2
                }],
                description: "Is atmospheric methane concentration correlated to the extinction rates of marine species?",
                alpha: "0.0079",
                tradingFee: "0.03",
                initialLiquidityFloor: 53
            });
            test({
                branch: augur.branches.dev,
                numEvents: 3,
                events: [{
                    type: "scalar",
                    description: "How many new antibiotics will be approved by the FDA between today (December 26, 2015) and the end of 2020?",
                    expirationBlock: utils.date_to_block(augur, "1-1-2021"),
                    minValue: 0,
                    maxValue: 30,
                    numOutcomes: 2
                }, {
                    type: "binary",
                    description: "Will antibiotics be outlawed for agricultural use in China by the end of 2020?",
                    expirationBlock: utils.date_to_block(augur, "1-1-2021"),
                    minValue: 1,
                    maxValue: 2,
                    numOutcomes: 2
                }, {
                    type: "categorical",
                    description: "What will be the number one killer in the United States by January 1, 2025? Choices: cancer, heart attacks, infectious diseases, starvation, lava, other",
                    expirationBlock: utils.date_to_block(augur, "1-2-2025"),
                    minValue: 0,
                    maxValue: 1,
                    numOutcomes: 6
                }],
                description: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?",
                alpha: "0.0079",
                tradingFee: "0.025",
                initialLiquidityFloor: 61
            });
        });
    });
}
