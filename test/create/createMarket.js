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
                initialLiquidityFloor: 50,
                metadata: {
                    marketId: "-0x959b7b4e7554f44a3f0f203fcf6cc572df728c7ca865df163c10604eadf3c5bb",
                    details: "The United States presidential election of 2016, scheduled for Tuesday, November 8, 2016, will be the 58th quadrennial U.S. presidential election.",
                    tags: ["politics", "US elections", "president"],
                    source: "generic",
                    broadcast: true,
                    links: [
                        "https://en.wikipedia.org/wiki/United_States_presidential_election,_2016",
                        "http://www.ontheissues.org/"
                    ],
                    image: "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"
                }
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
                "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2017?",
                utils.date_to_block(augur, "1-1-2018"),
                {
                    details: "NASA took a significant step Friday toward expanding research opportunities aboard the International Space Station with its first mission order from Hawthorne, California based-company SpaceX to launch astronauts from U.S. soil.\n\nThis is the second in a series of four guaranteed orders NASA will make under the Commercial Crew Transportation Capability (CCtCap) contracts. The Boeing Company of Houston received its first crew mission order in May.\n\n\"It's really exciting to see SpaceX and Boeing with hardware in flow for their first crew rotation missions,\" said Kathy Lueders, manager of NASA's Commercial Crew Program. \"It is important to have at least two healthy and robust capabilities from U.S. companies to deliver crew and critical scientific experiments from American soil to the space station throughout its lifespan.\"\n\nDetermination of which company will fly its mission to the station first will be made at a later time. The contracts call for orders to take place prior to certification to support the lead time necessary for missions in late 2017, provided the contractors meet readiness conditions.\n\nFull story: http://www.nasa.gov/press-release/nasa-orders-spacex-crew-mission-to-international-space-station",
                    tags: ["space", "SpaceX", "astronaut"],
                    source: "NASA",
                    broadcast: true,
                    links: [
                        "http://www.spacex.com",
                        "http://www.nasa.gov/press-release/nasa-orders-spacex-crew-mission-to-international-space-station",
                        "http://www.popsci.com/first-crewed-private-spaceflights-may-not-fly-in-2017-according-to-safety-report"
                    ]
                }
            ], [
                "Will the Larsen B ice shelf collapse by November 1, 2017?",
                utils.date_to_block(augur, "11-2-2017")
            ], [
                "Will Hillary Clinton win the 2016 U.S. Presidential Election?",
                utils.date_to_block(augur, "1-2-2017")
            ], [
                "Will Bernie Sanders win the 2016 Democratic nomination for U.S. President?",
                utils.date_to_block(augur, "7-29-2016")
            ]];
            it.each(events, "%s", ["element"], function (element, next) {
                this.timeout(augur.constants.TIMEOUT*2);

                // create an event
                var branch = augur.branches.dev;
                var description = element[0];
                var expDate = (EXPIRING) ?
                    5*blockNumber + Math.round(Math.random() * 1000) : element[1];
                var metadata = element[2];
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
                                metadata.marketId = marketID;
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
                                        augur.ramble.addMetadata(metadata, function (sentResponse) {
                                            console.log("addMetadata sent:", sentResponse);
                                        }, function (successResponse) {
                                            console.log("addMetadata success:", successResponse);
                                            next();
                                        }, next);
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
